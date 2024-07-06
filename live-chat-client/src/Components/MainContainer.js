import React, { createContext, useState } from 'react'
import "./myStyles.css";
import Sidebar from './Sidebar';
import ChatArea from "./ChatArea";
import Welcome from './Welcome';
import CreateGroups from './CreateGroups';
import { Outlet } from 'react-router-dom';
import Groups from './Groups';
import Users from './Users';
import { useDispatch, useSelector } from 'react-redux';

export const myContext = createContext();
function MainContainer() {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const lightTheme = useSelector((state) => state.themeKey);
  
  return (
    <div className={'main-container' + (lightTheme? "" : " dark2")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
      {/* <Welcome /> 
      <CreateGroups />
      <ChatArea props={conversations[0]}/>
      <Groups />
      <Users /> */}
    </div>
  )
}

export default MainContainer
