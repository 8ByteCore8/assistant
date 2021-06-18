import React from 'react';
import './header.css';
import {Link} from "react-router-dom";
import {setAuthorizationStatus} from "../../reducers/userReducer";
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";

const Header = (props: any) => {
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    const exit = () => {
        dispatch(setAuthorizationStatus("notAuthorized"));
        removeCookie("session");
    }

    return (
        <header className="headerWrapper">
            <div className="container">
                <div className="row headerContent">
                    <div className="col-7"><Link to="/" className="logoText">ASSISTANT</Link></div>
                    <div className="col-3 headerName">Россихин Владислав Юрійович</div>
                    <div className="col-2 headerExit"><button onClick={exit} className="btn">Выход</button></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
