import React, { useContext, useEffect } from 'react';
import { Context } from '../Context';

const VideoPlayer = () => {

  const {name, callee,localStream, localStreamRef, remoteStream,remoteStreamRef, endCall} = useContext(Context);

  useEffect(() => {
    if(localStreamRef.current) localStreamRef.current.srcObject = localStream;
    if(remoteStreamRef.current) remoteStreamRef.current.srcObject = remoteStream;
  }, [localStream, remoteStream]);

  return (
    <>
    <div className='videos'>

      <div>
        <h2>{name || 'My name'}</h2>
        <video playsInline muted autoPlay ref={localStreamRef} className="localStream"/>
      </div>

      <div>
        <h2>{callee.name || 'Unknown User'}</h2>
        <video playsInline autoPlay ref={remoteStreamRef} className="remoteStream"/>
      </div>
    </div>
    <button className='EndCallButton' onClick={endCall}>End Call</button>
    </>
  )
}

export default VideoPlayer;