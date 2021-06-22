import React, {useEffect} from 'react';
import UserProjects from '../../components/userProjects';
import './home.css';

const Home = (props: any) => {
    return (
        <div className="homePageWrapper">
            <h2 className="standardTitle homeTitle">Активні проекти</h2>
            <UserProjects/>
        </div>
    );
};

export default Home;
