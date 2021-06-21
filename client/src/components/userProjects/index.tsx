import React, {useEffect, useState} from 'react';
import './userProjects.css';
import {useDispatch, useSelector} from "react-redux";
import {setProjectList} from "../../reducers/projectReducer";
import {useCookies} from "react-cookie";

const UserProjects = (props: any) => {
    const dispatch = useDispatch();

    const [IsLoaded, setIsLoaded] = useState(false);
    const projectList = useSelector((state: any) => state.projects.list);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);

    useEffect(() => {
        const getProjectList = async () => {
            setIsLoaded(false);
            const res = await fetch("http://localhost:3000/api/projects/", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + cookies.session
                }
            });
            setIsLoaded(true);

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
        }

        getProjectList()
    }, []);

    const RETURN_LOADED = projectList.length > 0 ?
        (
            <div>
                DATA
            </div>
        ) :
        (
            <div>No data.</div>
        );

    return IsLoaded ?
        RETURN_LOADED :
        (
            <div>Loading...</div>
        )

};

export default UserProjects;
