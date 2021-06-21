import React, {useState} from 'react';
import './login.css';
import {setAuthorizationStatus} from "../../reducers/userReducer";
import {useDispatch} from "react-redux";
import {useCookies} from 'react-cookie';

const Login = (props: any) => {
    const dispatch = useDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const res = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password})
        })

        try {
            const body = await res.json();

            if (res.ok && body.token) {
                setCookie("session", body.token, {
                    maxAge: 3600
                })
                dispatch(setAuthorizationStatus("authorized"));
            } else {
                if (body.error === "Invalid login data.") {
                    setError("Невірно введено ім'я користувача або пароль.")
                } else {
                    setError("Невідома помилка сервера. Спробуйте пізніше.")
                }
            }
        }catch (e) {
            return setError("Невідома помилка сервера. Спробуйте пізніше. Код: " + res.status);
        }
    };

    return (
        <div className="loginFormWrapper">
            <div className="loginForm">
                <div className="loginFormHeader">
                    Будь-ласка, увійдіть в систему.
                </div>
                {error && <div className="loginFormErrorRow">{error}</div>}
                <form onSubmit={onSubmit} className="loginFormContent">
                    <label htmlFor="login">Логін</label>
                    <input value={login} onChange={(e) => setLogin(e.target.value)} className="form-control"
                           id="login"
                           type="text"/>
                    <label htmlFor="password">Пароль</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="form-control"
                           id="password" type="password"/>
                    <button type="submit" className="btn btn-success">Вхід</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
