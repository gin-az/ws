import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import s from '../styles/Main.module.css'

const FIELDS = {
    NAME: "name",
    ROOM: "room"
}

const Main = () => {
    const { NAME, ROOM } = FIELDS;
    const [values, setValues] = useState({ [NAME]: '', [ROOM]: '' });

    const handleChange = ({target: {value, name }}) => {
        console.log(value)
        console.log(name)
        setValues({ ...values, [name]: value });
    };

    // const handleClick = (e) => {
    //     e.preventDefault();
    // }

    console.log('values', values)

    return (
        <div className={s.wrap}>
            <div className={s.container}>
                <h1 className={s.heading}>
                    #ХайГайс!
                </h1>
                <form className={s.form}>
                    <div className={s.group}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Как к Вам обращаться в чатике?"
                            value={values[NAME]}
                            onChange={handleChange}
                            autoComplete="off"
                            className={s.input}
                        />
                    </div>
                    <div className={s.group}>
                        <input
                            type="text"
                            name="room"
                            placeholder="Комната"
                            value={values[ROOM]}
                            onChange={handleChange}
                            autoComplete="off"
                            className={s.input}
                            required
                        />
                    </div>
                    <Link className={s.group} to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
                        <button type="submit" className={s.button} disabled={!values[ROOM] || !values[NAME]}>Войти</button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Main;