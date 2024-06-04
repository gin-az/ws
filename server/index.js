const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();

const route = require('./route');
const { addUser, findUser, getCountUsers, removeUser } = require("./users");

app.use(cors({ origin: "*" })); // middleware
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Слушатель подключения
io.on('connection', (socket) => {
    socket.on("join", ({ name, room }) => {
        socket.join(room);

        const { user, isExist } = addUser({ name, room });

        const userMessage = isExist ? `${user.name}, снова здравствуй` : `Welcome, ${user.name}! Помним правила хорошего тона!`;

        socket.emit('message', {
            data: { user: { name: "Admin" }, message: userMessage},
        });

        socket.broadcast.to(user.room).emit('message', {
            data: { user: { name: "Admin" }, message: `К нам присоединился ${user.name}`},
        });

        io.to(user.room).emit('room', {
            data: { users: getCountUsers(user.room) } });
    });

    // Слушатель отправки сообщения
    socket.on("sendMessage", ({ message, params }) => {
        const user = findUser(params);

        if (user) {
            io.to(user.room).emit('message', { data: { user, message } });
        }
    });

    socket.on("exitRoom", ({ params }) => {
        const user = findUser(params);

        if (user) {
            const {room, name} = user;

            io.to(room).emit('message', {data: {user: {name: "Admin"}, message: `${name} покинул чат`}});
            removeUser(params)
            io.to(room).emit('room', {
                data: {users: getCountUsers(room)}
            });
        }
    });

    io.on("disconnect", () => {
        console.log("Disconnect");
    });
});

server.listen(5000, () => {
    console.log("Сервер запущен!")
});