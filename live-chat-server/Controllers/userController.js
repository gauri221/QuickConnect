const express = require("express")
const UserModel = require("../models/userModel")
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../Config/generateToken");

//Login
const loginController = expressAsyncHandler( async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const user = await UserModel.findOne({username})

    console.log("fetched user Data", user);
    console.log(await user.matchPassword(password))

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    }
    else {
        throw new Error("Invalid Username or Password")
    }
});


//Registration
const registerController = expressAsyncHandler (async (req, res) => {
    const {username, email, password} = req.body;

    // check for all fields
    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields need to be filled" });
    }

    // pre-existing user
    const UserExist = await UserModel.findOne({ email })
    if (UserExist) {
        throw new Error("User already exists")
    }

    //userName already taken
    const UserNameExist = await UserModel.findOne({ username })
    if (UserNameExist) {
        throw new Error("username already taken")
    }


    // create an entry in the db
    const user = await UserModel.create({ username, email, password });

    //encrypt
    if (user) {
        res.status(201).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id),
        })
    }
    else {
        res.status(400)
        throw new Error("Registration Error")
    }
});


const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
    ?{
        $or: [
            { username: { $regex: req.query.search, $options: "i"} },
            { email: { $regex: req.query.search, $options: "i"} },
        ],
    }
    : {};
    
    const users = await UserModel.find(keyword).find({
        _id: { $ne: req.user._id },
    }); 
    res.send(users);
});




module.exports = {
    loginController, 
    registerController,
    fetchAllUsersController
}