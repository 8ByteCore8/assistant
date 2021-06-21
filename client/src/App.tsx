import React, {useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {useCookies} from 'react-cookie';
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import Header from "./components/header";
import Footer from "./components/footer";
import {useDispatch, useSelector} from "react-redux";
import {setAuthorizationStatus, setUserData} from "./reducers/userReducer";
import Project from "./pages/Project";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

const App = (props: any) => {
    const dispatch = useDispatch();

    const authorizationStatus = useSelector((state: any) => state.user.authorizationStatus);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    useEffect(() => {
        const getUserData = async () => {
            const res = await fetch("http://localhost:3000/api/users/", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + cookies.session
                }
            });

            try {
                if(res.ok){
                    const userData = await res.json();
                    dispatch(setUserData({
                        authorizationStatus: "authorized",
                        ...userData
                    }));
                }else{
                    dispatch(setAuthorizationStatus("notAuthorized"));
                    removeCookie("session");
                }
            }catch (e){
                console.log(e);
            }
        }

        if (cookies.session) {
            getUserData();
        } else {
            dispatch(setAuthorizationStatus("notAuthorized"));
        }
    }, [cookies]);

    switch (authorizationStatus) {
        case "needConfirmation":
            return <></>;
        case "authorized":
            return (
                <>
                    <Header/>
                    <div className="mainWrapper container">
                        <Switch>
                            <Route path={["/", "/project/"]} exact component={HomePage}/>
                            <Route path='/project/:id'  component={Project}/>
                            <Route path='/profile'  component={Profile}/>
                            <Route path='/editProfile'  component={EditProfile}/>
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
