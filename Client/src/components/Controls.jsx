import React, { useContext, useState } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Context } from '../Context';

const Controls = () => {

  const {peerID, name, setName, initiateCall} = useContext(Context);
  
  const [remoteUserID, setRemoteUserID] = useState('');

    return (
      <div>
        <div className='controlsWrapper'>
          <h2><u>Make a Call</u></h2>
          <form noValidate autoComplete='off'>
            <input value={name} placeholder="Set your name" onChange={(e)=>{setName(e.target.value)}}/><br/><br/>
            <input value={remoteUserID} placeholder="id to call" onChange={(e)=>{setRemoteUserID(e.target.value)}}/><br/><br/>
            <CopyToClipboard text={peerID}>
              <button className='ctrlButtons' type='button'>Copy my ID</button>
            </CopyToClipboard>
            <button className='ctrlButtons' type='button' onClick={() => {initiateCall(remoteUserID)}}>Call ☎</button>
          </form>
          <p> {peerID ? (
            <small>My ID: <span className='myID'>{peerID}</span></small>
          ) : (
            <span>Generating ID...</span>
          )} </p>

        </div>
      </div>
    )
  }
  
  export default Controls;