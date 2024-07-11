import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";
import {useLocation, useNavigate} from "react-router";
import EmojiPicker from "emoji-picker-react";

import icon from "../images/emoji.svg"
import s from "../styles/Chat.module.css";
import Messages from "./Messages";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
    const { search } = useLocation();
    const [params, setParams] = useState({room: "", user: ""});
    const [state, setState] = useState([]);
    const [message, setMessage] = useState('');
    const [isOpenEmojis, setIsOpenEmojis] = useState(false);
    const [users, setUsers] = useState(0);

    const navigate = useNavigate();

    useEffect(() =>{
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams);
        socket.emit("join", searchParams);
    },[search]);

    useEffect(() => {
        socket.on('message', ({ data }) => {
            setState((prev) => ([ ...prev, data ]));
        })
    },[]);

    useEffect(() => {
        socket.on('room', ({ data: { users } }) => {
            setUsers(users.length);
        })
    },[])

    const handleExit = () => {
        socket.emit("exitRoom", { params });
        navigate("/");
    };
    const handleChange = ({ target: { value } }) => setMessage(value);
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message) return;

        socket.emit("sendMessage", { message, params });

        setMessage("");
    };

    const handleOpenEmojis = () => setIsOpenEmojis(!isOpenEmojis);
    const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

    return (
        <div className={s.wrap}>
            <div className={s.header}>
                <div className={s.title}>Комната: {params && params.room}</div>
                <div className={s.title}>Участников: {users}</div>
                <button onClick={handleExit} className={s.left}>Покинуть чат</button>
            </div>
            <div className={s.messages}>
                <Messages messages={state} name={params.name} />
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.input}>
                    <input
                        type="text"
                        name="message"
                        placeholder="Введите сообщение..."
                        value={message}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={s.emoji}>
                    <img src={icon} alt="emoji" onClick={handleOpenEmojis}/>
                    {isOpenEmojis && (
                        <div className={s.emojies}>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
                <div className={s.button}>
                    <input type="submit" onSubmit={handleSubmit} value="Отправить" />
                </div>
            </form>
            {/*<ul>*/}
            {/*    {state.map((item, index) => <li key={index}>{item.user.name}: {item.message}</li>)}*/}
            {/*</ul>*/}

        </div>
    );
};

export default Chat;