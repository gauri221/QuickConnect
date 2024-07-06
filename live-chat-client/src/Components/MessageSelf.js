import React from 'react'
import "./myStyles.css"
import { useSelector } from 'react-redux';

function MessageSelf({props}) {
    const lightTheme = useSelector((state) => state.themeKey);
    
  return (
    <div className={'self-message-container'  + (lightTheme? "" : " dark")}>
     <div className={'messageBox'}>
        <p style={{ color: "black" }} >{props.content}</p>
        {/* <p className={'self-timeStamp' + (lightTheme? "" : " dark")}>12:00am</p> */}
      </div>
    </div>
  )
}

export default MessageSelf
