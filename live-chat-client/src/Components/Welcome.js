import React from "react";
import logo from "../Images/chat.png";
import {motion} from "framer-motion"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Welcome() {
    const lightTheme = useSelector((state) => state.themeKey);
    const userData = JSON.parse(localStorage.getItem("userData"))
    console.log(userData)
    const nav = useNavigate();
    if (!userData) {
        console.log("User not Authenticated");
        nav("/");
    }

    return (
    <div className={"welcome-container" + ( lightTheme ? "" : " dark")}>
        <motion.img
            drag
            whileTap={{ scale: 1.05, rotate: 360 }}
            src={logo} 
            alt="Logo" 
            className="welcome-logo"
         />
         <b> Hi, {userData.data.username} </b>
        <p>View and text directly to people present in the chat rooms.</p>
    </div>
    )
}

export default Welcome