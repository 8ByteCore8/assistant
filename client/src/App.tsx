import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import LoginPage from "./pages/login/Login";
// import {useDispatch, useSelector} from "react-redux";
// import {setCount} from "./reducers/reposReducer";

const App = () => {
    // const [status, setStatus] = useState(false);
    //
    // useEffect(() => {
    //     console.log("123");
    // }, [])
    // const dispatch = useDispatch();
    // const count = useSelector((state: any) => state.repos.count);

    return (
        <Router>
            {/*{count}*/}
            {/*<button onClick={() => dispatch(setCount(count + 1))}>TEXT</button>*/}
            <Route path='/login' component={LoginPage}/>
        </Router>
    );
};

export default App;
