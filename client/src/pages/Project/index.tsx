import React, {useEffect, useState} from 'react';
import './project.css';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import {setProjectList} from "../../reducers/projectReducer";
import {Skeleton} from "@material-ui/lab";

const Project = (props: any) => {
    const dispatch = useDispatch();

    const {id} = useParams<any>();
    const projectsList = useSelector((state: any) => state.projects.list);
    const projectInfo = projectsList.filter((val) => val.id == id)[0];

    const [IsLoaded, setIsLoaded] = useState(projectInfo !== undefined);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    useEffect(() => {
        const getProject = async () => {
            const res = await fetch("http://localhost:3000/api/projects/" + id, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + cookies.session
                }
            });

            try {
                if (res.ok) {
                    projectsList.push(await res.json());
                    dispatch(setProjectList(projectsList));
                } else {
                    alert("Неможливо отримати список проектів");
                }
            } catch (e) {
                console.log(e);
            }

            setIsLoaded(true);
        }

        if (!projectInfo) {
            getProject();
        }
    }, []);

    console.log(projectInfo);

    const RETURN_TASKS = projectInfo && projectInfo.tasks && projectInfo.tasks.length > 0 ? (
            <>
                {projectInfo.tasks.map((e, i) => (
                    <div className="projectTaskBlockWrapper">
                        <h5 className="projectTaskName">{i + 1}. {e.name.charAt(0).toUpperCase() + e.name.slice(1)}</h5>
                    </div>
                ))}
            </>
        ) :
        (
            <div>Для цього проекту ще не додано жодного завдання.</div>
        );

    return IsLoaded ?
        <div className="projectPageWrapper">
            <h2 className="standardTitle projectTitle">Завдання проекту "{projectInfo.name}"</h2>
            <div className="projectPageDescription">{projectInfo.description}</div>
            {RETURN_TASKS}
        </div> :
        (
            <div className="projectPageWrapper">
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
        );
};

export default Project;
