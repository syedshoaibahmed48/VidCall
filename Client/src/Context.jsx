import React, {createContext, useState, useEffect, useRef}  from "react";
import {useNavigate} from 'react-router-dom';
import {Peer} from 'peerjs';

const Context = createContext();

const ContextProvider = ({children}) => {

    const [localStream, setLocalStream] = useState({});
    const [remoteStream, setRemoteStream] = useState({});
    const [peerID, setPeerID] = useState('');
    const [name, setName] = useState('');
    const [callee,setCallee] = useState({ id: '', name: '' });
    const [callInProgress, setCallInProgress] = useState(false);
    const [inComingCall, setInComingCall] = useState(false);

    const localStreamRef = useRef();
    const remoteStreamRef = useRef();
    const peerRef = useRef();
    const callRef = useRef();
    const navigate= useNavigate();

    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
            setLocalStream(stream);
            if(localStreamRef.current) localStreamRef.current.srcObject = stream;
        })
        .catch((error) => {
            //console.log('Error accessing media devices', error);
          });

        createPeer();  //create peer on page load

        window.addEventListener("beforeunload", endCall); //cleanup on window close

    }, []);

    useEffect(() => {
        if(!callInProgress) endCall(); //if call is not in progress, navigate to home page
    }, [callInProgress]);

    const createPeer = () => {//create peer and set peerID
        const peer = new Peer(undefined, {
            host: 'localhost',
            port: '5000',
            path: '/VidCall',
        });

        setPeerID(peer.id);

        peerRef.current = peer;
        
        peer.on('open', (id) => {
           // console.log("my peerID:",id);
            setPeerID(id);
        });

        peer.on("connection", (connection) => { //when a connection is recieved from a peer
           // console.log("connection recieved from:",connection.peer);

            connection.on('close', () => {
               // console.log("disconnected from:",connection.peer);
                setCallInProgress(false);
            });
        });

        peer.on('call', (call) => {//when a call is recieved from a peer
            //console.log('call recieved from:', call.peer, 'with object:', call);
            handleIncomingCall(call);
        });

    }

    const goToCallPage = (id) => {
        navigate(`/call/${id}`);
    }

    const initiateCall = (id) => {//initiate call to peer
        if(!id){
            alert('Please enter a valid ID to call');
            return;
        }

        if(!name){
            alert('Please enter your name');
            return;
        }

        const connection = peerRef.current.connect(id, {name: name}); //connect to peer
        connection.on('open', () => {
            //console.log("connected with:",id);
            setCallee({id: id, name: 'Unknown User'});
        });
        
        connection.on('close', () => {
            //console.log("disconnected from:",connection.peer);
            setCallInProgress(false);
        });

        const call = peerRef.current.call(id, localStream, {metadata: name}); //call peer and send stream
        //console.log("call made to:",id, 'with object', call);
        callRef.current = call;
        setCallInProgress(true);
        call.on('stream', (userStream) => { //when stream is recieved from peer
            //console.log('recieved stream', userStream);
            setRemoteStream(userStream);
            if(remoteStreamRef.current) remoteStreamRef.current.srcObject = userStream;
            goToCallPage(peerID);
        });
        call.on('close', () => {
           // console.log('call ended');
            endCall();
        });
      }

    const handleIncomingCall = (call) => {//handle incoming call from peer
        setInComingCall(true);
        const calleeName = call.metadata || 'unknown user';
        setCallee({id: call.peer, name: calleeName});
        //console.log('handling call from:', calleeName);
        callRef.current = call;
      }

    const acceptCall = () => {        
        //console.log('call accepted');
        setInComingCall(false);
        setCallInProgress(true);
        callRef.current.answer(localStream);
        callRef.current.on('stream', (userStream) => { //when stream is recieved from peer
            //console.log('recieved stream', userStream);
            setRemoteStream(userStream);
            if(remoteStreamRef.current) remoteStreamRef.current.srcObject = userStream;
            goToCallPage(callee.id);
        });
        callRef.current.on('close', () => {
            //console.log('call ended');
            endCall();
        });
    }


    const endCall = () => {//end call with peer and close all connections
        //console.log('ending call')

        peerRef.current.destroy();

        createPeer();

        //cleanup
        setInComingCall(false);
        setCallee({id: '', name: ''});
        remoteStreamRef.current = null;
        callRef.current = null;
        navigate('/');
        setCallInProgress(false);
    }

    return (
        <Context.Provider value={{
            localStream,
            localStreamRef,
            remoteStream,
            remoteStreamRef,
            peerID,
            name,
            setName,
            callee,
            setCallee,
            callInProgress,
            setCallInProgress,
            initiateCall,
            peerRef,
            inComingCall,
            setInComingCall,
            acceptCall,
            endCall
        }}>
        {children}
        </Context.Provider>
    );
};

export{ContextProvider, Context};