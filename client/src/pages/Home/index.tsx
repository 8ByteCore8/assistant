import React, {useEffect} from 'react';
import UserProjects from '../../components/userProjects';
import {setAuthorizationStatus, setUserData} from "../../reducers/userReducer";

const Home = (props: any) => {
    return (
        <>
            <h2 className="standardTitle">Активні проекти</h2>
            <UserProjects/>
        </>
    );
};

export default Home;
