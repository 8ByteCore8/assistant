import React from 'react';
import './header.css';
import {Link} from "react-router-dom";
import {setAuthorizationStatus} from "../../reducers/userReducer";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import {PersonCircle, PersonBoundingBox, BoxArrowRight, Gear, Bell, Chat} from 'react-bootstrap-icons';

const Header = (props: any) => {
    const dispatch = useDispatch();

    const userData = useSelector((state: any) => state.user);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    const exit = () => {
        dispatch(setAuthorizationStatus("notAuthorized"));
        removeCookie("session");
    }

    return (
        <header className="headerWrapper">
            <div className="container">
                <div className="row headerContent">
                    <div className="col-8"><Link to="/" className="logoText">ASSISTANT</Link></div>
                    <div className="col-4 headerProfileWrapper">
                        <div className="headerNotifications">
                            <Bell/>
                        </div>
                        <div className="headerChat">
                            <Chat/>
                        </div>
                        <div className="headerProfile">
                            {userData.lastname} {userData.name} <PersonCircle className="headerPersonIcon"/>
                            <ul className="headerProfileDropdown">
                                <Link to="/profile">
                                    <li><PersonBoundingBox/> Профіль</li>
                                </Link>
                                <Link to="/editProfile">
                                    <li><Gear/> Налаштування</li>
                                </Link>
                                <li onClick={exit}><BoxArrowRight/> Вихід</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
