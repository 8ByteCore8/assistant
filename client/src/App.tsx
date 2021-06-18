import React, {useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {useCookies} from 'react-cookie';
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import Header from "./components/header";
import Footer from "./components/footer";
import {useDispatch, useSelector} from "react-redux";
import {setAuthorizationStatus} from "./reducers/userReducer";

const App = () => {
    const dispatch = useDispatch();

    const authorizationStatus = useSelector((state: any) => state.user.authorizationStatus);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    useEffect(() => {
        if (cookies.session) {
            fetch("http://localhost:3000/api/auth/check", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + cookies.session
                }
            })
                .then((result) => {
                        if (result.ok) {
                            dispatch(setAuthorizationStatus("authorized"));
                        } else {
                            dispatch(setAuthorizationStatus("notAuthorized"));
                            //removeCookie("session");
                        }
                    },
                    (error) => {
                        console.log(error);
                    })
        } else {
            dispatch(setAuthorizationStatus("notAuthorized"));
        }
    }, []);

    switch (authorizationStatus) {
        case "needConfirmation":
            return <></>;
        case "authorized":
            return (
                <>
                    <Header/>
                    <div className="main container">
                        <Switch>
                            <Route path='/' exact component={HomePage}/>
                            <Route component={NotFoundPage}/>
                        </Switch>
                    </div>
                    <Footer/>
                </>
            )
        default:
            return <LoginPage/>;
    }
};

export default App;
