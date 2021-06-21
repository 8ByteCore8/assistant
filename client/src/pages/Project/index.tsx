import React, {useState} from 'react';
import './project.css';
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const Project = (props: any) => {
    const {id} = useParams<any>();
    const projectInfo = useSelector((state: any) => state.projects.list.filter((val) => val.id == id)[0]);



    return (
        <div className="projectPageWrapper">
            {id}
        </div>
    );
};

export default Project;
