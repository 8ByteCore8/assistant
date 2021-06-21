import React, {useEffect, useState} from 'react';
import './userProjects.css';
import {useDispatch, useSelector} from "react-redux";
import {setProjectList} from "../../reducers/projectReducer";
import {useCookies} from "react-cookie";
import {Skeleton} from '@material-ui/lab';
import NotFoundImage from '../../images/courses.svg';
import BackgroundImage from '../../images/back-1.jpg';
import {Link} from "react-router-dom";

const UserProjects = (props: any) => {
    const dispatch = useDispatch();

    const projectList = useSelector((state: any) => state.projects.list);
    const [IsLoaded, setIsLoaded] = useState(projectList.length > 0);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    useEffect(() => {
        const getProjectList = async () => {
            const res = await fetch("http://localhost:3000/api/projects/", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + cookies.session
                }
            });

            try {
                if (res.ok) {
                    const LIST = await res.json();

                    dispatch(setProjectList(LIST));
                } else {
                    alert("Неможливо отримати список проектів");
                }
            } catch (e) {
                console.log(e);
            }

            setIsLoaded(true);
        }

        getProjectList();
    }, []);

    const RETURN_LOADED = projectList.length > 0 ?
        (
            <div className="userProjectsWrapper">
                <div className="userProjectList">
                    {projectList.map((e) => {
                        return (
                            <Link key={e.id} to="/project/1" className="userProjectBlock">
                                <div style={{backgroundImage: `url(${BackgroundImage})`}}
                                     className="userProjectBlockImage"/>
                                <div className="userProjectBlockInfo">
                                    <div className="userProjectBlockName">{e.name}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        ) :
        (
            <div className="userProjectsWrapper">
                <div className="userProjectEmptyDataWrapper">
                    <img src={NotFoundImage} alt="EMPTY"/>
                    <h5>Список ваших проектів пустий.</h5>
                    <span>Тільки викладач може додати новий проект до вашого профілю</span>
                </div>
            </div>
        );

    return IsLoaded ?
        RETURN_LOADED :
        (
            <div className="userProjectsWrapper">
                <div className="userProjectList">
                    {Array(4).fill((
                        <div className="userProjectBlock">
                            <Skeleton variant="rect" className="userProjectBlockImage"/>
                            <div className="userProjectBlockInfo">
                                <Skeleton variant="text" className="userProjectBlockName"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )

};

export default UserProjects;
