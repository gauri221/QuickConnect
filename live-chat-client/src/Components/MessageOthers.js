import React from 'react'
import "./myStyles.css"
import { useSelector } from 'react-redux';

function MessageOthers({props}) {
   const lightTheme = useSelector((state) => state.themeKey);
   console.log(props);

  return (
    <div className={'other-message-container' + (lightTheme? "" : " dark")}>
     <div className={'conversation-container' + (lightTheme? "" : " dark")}>
        {/* <p className={'con-icon'  + (lightTheme? "" : " dark")}>{props.sender.username[0]}</p> */}
        <div className={'other-text-content' + (lightTheme? "" : " dark")}>
            <p className={'con-title' + (lightTheme? "" : " dark")}>{props.sender.username} </p>
            <p className={'con-lastMessage' + (lightTheme? "" : " dark")}>{props.content} </p>
            {/* <p className={'self-timeStamp' + (lightTheme? "" : " dark")}>12:00am</p> */}
        </div>
     </div>
    </div>
  )
}

export default MessageOthers
