const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const {default : mongoose } = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const groupRoutes = require("./Routes/groupRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();
app.use(cors({
    origin: "*",
})
)
app.use(express.json())

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("The server is connected to Db")
    } catch (err) {
        console.log("Server is not connected to Db", err.message)
    }
};
connectDb();


app.get("/", (req, res) => {
    res.send("Keep Going ");
})

app.use("/user", userRoutes)
app.use("/chat", chatRoutes)
app.use("/message", messageRoutes)
app.use("/group", groupRoutes)

//Error Handling middlewares 
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,  () => console.log("Server is running...."));

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
    pingTimeout: 60000,
});

io.on("connection", (socket) => {   
    // console.log("socket.io connection established")

    socket.on("setup", (user) => {
        socket.join(user.data._id);
        //console.log("server :// joined user : ", user.data._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        // console.log("user joined room : ", room);
    });

    socket.on("new message", (newMessageStatus) => {
        var chat = newMessageStatus.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach((user) => {
            if (user._id === newMessageStatus.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    });
});
