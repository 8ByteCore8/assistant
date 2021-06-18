import React, {useState, useEffect} from 'react';
import {Route, Switch} from "react-router-dom";
import {useCookies} from 'react-cookie';
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import Header from "./components/header";
import Footer from "./components/footer";
// import {useDispatch, useSelector} from "react-redux";
// import {setCount} from "./reducers/reposReducer";

const App = () => {
    // const dispatch = useDispatch();
    // const count = useSelector((state: any) => state.repos.count);

    const [authorizationStatus, setAuthorizationStatus] = useState("needConfirmation");
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
                            setAuthorizationStatus("authorized");
                        } else {
                            setAuthorizationStatus("notAuthorized");
                            //removeCookie("session");
                        }
                    },
                    (error) => {
                        console.log(error);
                    })
        } else {
            setAuthorizationStatus("notAuthorized");
        }
    }, []);

    switch (authorizationStatus) {
        case "needConfirmation":
            return <></>;
        case "authorized":
            return (
                <>
                    <Header/>
                    {/*{count}*/}
                    {/*<button onClick={() => dispatch(setCount(count + 1))}>TEXT</button>*/}
                    <Switch>
                        <Route path='/' exact component={HomePage}/>
                        <Route component={NotFoundPage} />
                    </Switch>
                    <Footer/>
                </>
            )
        default:
            return <LoginPage/>;
    }
};

export default App;
