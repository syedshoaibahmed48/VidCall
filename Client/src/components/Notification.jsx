import React, { useContext } from 'react';
import {Context} from '../Context';
import '../App.css'

const Notification = () => {

  const {inComingCall, callee, callInProgress, acceptCall} = useContext(Context);


  return (
    <div className='notification'>
      {inComingCall && !callInProgress && (
        <>
          <h3>{callee.name} is calling you</h3>
          <button onClick={acceptCall}>Accept</button>
        </>
      )}

      {callInProgress && !inComingCall && (
        <>
          <h3>Calling</h3>
        </>
      )}


    </div>
  
  )
}

export default Notification