import React, { useContext, useRef, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { useDispatch, useSelector } from 'react-redux';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import { refreshSidebarFun } from "../Features/refreshSidebar";
import axios from 'axios';
import { myContext } from "./MainContainer";

const ENDPOINT = "http://localhost:5000";
let socket;

function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState('');
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { refresh, setRefresh } = useContext(myContext);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios.post("http://localhost:5000/message/", {
      content: messageContent,
      chatId: chat_id,
    }, config).then(({ data }) => {
         console.log("Message fired");
        // socket.emit("new message", data);
        // setAllMessages([...allMessages, data]);
        // socket.emit("newMessage", data);
        // setMessageContent("");
        // setRefresh(!refresh);
      });
  };

  // connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    //socket.on("connected", () => {
    socket.on("connect", () => {
      console.log("Socket connected");
    });
  }, [userData]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);

  // fetch chats
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios.get(`http://localhost:5000/message/${chat_id}`, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoaded(true);
        socket.emit("join chat", chat_id);
      });
  }, [refresh, chat_id, userData.data.token]);

  //scrollIntoView 
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);
  

  if (!loaded) {
    return (
      <div style={{ border: "20px", padding: "10px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "10px" }} height={60} />
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "10px", flexGrow: "1" }} />
        <Skeleton variant="rectangular" sx={{ width: "100%", borderRadius: "10px" }} height={60} />
      </div>
    );
  } else {
    return (
      <div className={'chatArea-container' + (lightTheme ? "" : " dark2")}>
        <div className={'chatArea-header' + (lightTheme ? "" : " dark")}>
          <p className={'con-icon' + (lightTheme ? "" : " dark")}>{chat_user[0]}</p>
          <div className={'header-text' + (lightTheme ? "" : " dark")}>
            <p className={'con-title' + (lightTheme ? "" : " dark")}>{chat_user}</p>
          </div>
          <IconButton>
            <DeleteIcon className={'icon' + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
        <div 
          className={'messages-container' + (lightTheme ? "" : " dark")}
          ref={messagesEndRef}
        >
          {allMessages
            .slice(0)
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return < MessageSelf props={message} key={index} />;
              } else {
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div className={'text-input-area' + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={'search-box' + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
                dispatch(refreshSidebarFun());
              }
            }}
          />
          <IconButton
            className={'icon' + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setMessageContent("");
              setRefresh(!refresh);
              dispatch(refreshSidebarFun());
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
