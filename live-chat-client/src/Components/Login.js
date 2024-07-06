import React, { useState } from "react";
import "./myStyles.css";
import logo from "../Images/chat.png"
import  axios from "axios";
import { Button, TextField, Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Toaster from "./Toaster";

function Login() {
    const [ showlogin, setShowLogin ] = useState(false);
    const [ data, setData ] = useState({ username: "", email: "", password: "" });
    const [ loading, setLoading ] = useState(false);

    const [ logInStatus, setLogInStatus ] = React.useState("");
    const [ signInStatus, setSignInStatus ] = React.useState("");

    const navigate = useNavigate();

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const loginHandler = async (e) => {
        setLoading(true);
        console.log(data);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };

            const response = await axios.post(
                "http://localhost:5000/user/login",
                { username: data.username, password: data.password },
                config
            );
            console.log("Login :", response);
            setLogInStatus({ msg: "Success", key: Math.random() });
            setLoading(false);
            localStorage.setItem("userData", JSON.stringify(response));
            navigate("/app/welcome");
        }
        catch (error){
            setLogInStatus({
                msg: "Invalid User name or Password",
                key: Math.random(),
            });
        }
        setLoading(false);
    }

    const SignUpHandler = async () => {
        setLoading(true)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };

            const response = await axios.post(
                "http://localhost:5000/user/register/",
                data,
                config
            );
            console.log(response);
            setSignInStatus({ msg: "Success", key: Math.random() });
            navigate("/app/welcome");
            localStorage.setItem("userData", JSON.stringify(response));
            setLoading(false);
        } 
        catch (error){
          console.error("SignUp error:", error);
          if (error.response) {
            if (error.response.status === 405) {
                setSignInStatus({
                    msg: "This email is already in use",
                    key: Math.random(),
                });
            } else if (error.response.status === 406) {
                setSignInStatus({
                    msg: "Username already taken, please choose another one",
                    key: Math.random(),
                });
            } else {
                setSignInStatus({
                    msg: "An error occurred during registration",
                    key: Math.random(),
                });
            }
        } else {
            setSignInStatus({
                msg: "An error occurred during registration",
                key: Math.random(),
            });
        }

        }
        setLoading(false);
    }




  return (
    <>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="secondary" /> 
        </Backdrop>
        <div className="login-container">
            <div className="image-container">
                <img src={logo} alt="Logo" className="welcome-logo" />
            </div>
            {showlogin && (
            <div className="login-box">
                <p className="login-heading">Login to your account</p>
                <TextField 
                  onChange={ changeHandler }
                  id="outlined-basic" 
                  label="Enter username" 
                  variant="outlined" 
                  color="secondary"
                  name="username"
                />
                <TextField
                  onChange={ changeHandler }
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  color="secondary"
                  name="password"
                />
                <Button 
                   variant="contained"
                   color="secondary"
                   onClick={loginHandler}
                   isLoading
                   >
                    Login
                   </Button>
                <p> 
                    Do not have an account? {" "}
                    <span
                      className="hyper"
                      onClick={() => {
                        setShowLogin(false);
                      }}
                      >
                        Sign Up
                      </span>
                    </p>
                      {logInStatus ? (
                        <Toaster key={logInStatus.key} message={logInStatus.msg} />
                      ): null}
            </div>
            )}
            {!showlogin && (
            <div className="login-box">
                <p className="login-heading">Create your Account</p>
                <TextField 
                  onChange={ changeHandler }
                  id="outlined-basic" 
                  label="Enter Username" 
                  variant="outlined" 
                  color="secondary"
                  name="username"
                  helperText=""
                />
                <TextField 
                  onChange={ changeHandler }
                  id="outlined-basic" 
                  label="Enter email-id" 
                  variant="outlined" 
                  color="secondary"
                  name="email"
                />
                <TextField
                  onChange={ changeHandler }
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  color="secondary"
                  name="password"
                />
                <Button 
                   variant="contained"
                   color="secondary"
                   onClick={SignUpHandler}
                   isLoading
                   >
                    SignUp
                   </Button>
                <p> 
                    Already have an account? {" "}
                    <span
                      className="hyper"
                      onClick={() => {
                        setShowLogin(true);
                      }}
                      >
                        Login
                      </span>
                    </p>
                      {signInStatus ? (
                        <Toaster key={signInStatus.key} message={signInStatus.msg} />
                      ): null}
            </div>
            )}
        </div>
    </>
    )
}

export default Login