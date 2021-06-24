import React, {useEffect, useState} from 'react';
import './project.css';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import {setProjectList} from "../../reducers/projectReducer";
import {Skeleton} from "@material-ui/lab";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import {CaretDownFill, PersonLinesFill, List} from "react-bootstrap-icons";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Table from 'react-bootstrap/Table'

const Project = (props: any) => {
    const dispatch = useDispatch();

    const {id} = useParams<any>();
    const projectsList = useSelector((state: any) => state.projects.list);
    const projectInfo = projectsList.filter((val) => val.id == id)[0];

    const [IsLoaded, setIsLoaded] = useState(projectInfo !== undefined);
    const [cookies, setCookie, removeCookie] = useCookies(['session']);
    const [expanded, setExpanded] = useState('0');

    useEffect(() => {
        const getProject = async () => {
            if (IsLoaded) {
                setIsLoaded(false);
            }

            const res = await fetch("http://localhost:3000/api/projects/", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + cookies.session
                }
            });

            try {
                if (res.ok) {
                    const PROJECTS = await res.json();
                    dispatch(setProjectList(PROJECTS));
                } else {
                    alert("Помилка при отриманні даних проекту, спробуйте пізніше");
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

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const RETURN_TASKS = projectInfo && projectInfo.tasks && projectInfo.tasks.length > 0 ? (
            <>
                {projectInfo.tasks.map((e, i) => (
                    <Accordion expanded={expanded === 'panel' + i} onChange={handleChange('panel' + i)} className="taskAccordion" key={i}>
                        <AccordionSummary
                            expandIcon={<CaretDownFill/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <span className="taskName"><i>{i + 1}</i> <span>{e.name.charAt(0).toUpperCase() + e.name.slice(1)}</span></span>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="taskContentWrapper">
                                <h5 className="taskTitle first">Опис завдання</h5>
                                <span className="taskDescription">
                                    {e.description}
                                </span>
                                <div className="taskContentInput">
                                    <h5 className="taskTitle">Нова спроба</h5>
                                </div>
                                <div className="taskAttemptsContainer">
                                    <h5 className="taskTitle">Результати минулих спроб</h5>
                                    <Table className="attemptsTable" size="small">
                                        <thead>
                                            <tr>
                                                <th>Спроба</th>
                                                <th align="right">Час</th>
                                                <th align="right">Стан</th>
                                                <th align="right">Результат</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                                <th>2</th>
                                                <th align="right">2021.06.24 21:24</th>
                                                <th className="greenText" align="right">Оцінено</th>
                                                <th className="greenText" align="right">Вірно</th>
                                            </tr>
                                            <tr>
                                                <th>1</th>
                                                <th align="right">2021.06.23 12:25</th>
                                                <th className="greenText" align="right">Оцінено</th>
                                                <th className="redText" align="right">Не вірно</th>
                                            </tr>

                                        </tbody>
                                    </Table>

                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </>
        ) :
        (
            <div>Для цього проекту ще не додано жодного завдання.</div>
        );

    const RETURN_PROJECT = projectInfo ?
        (
            <div className="projectPageWrapper">
                <h2 className="standardTitle projectTitle">{projectInfo.name}</h2>
                <div className="projectAuthor iconText"><PersonLinesFill/> {projectInfo.author.lastname} {projectInfo.author.name} {projectInfo.author.surname}</div>
                <div className="projectPageDescription iconText"><List/> {projectInfo.description}</div>
                {RETURN_TASKS}
            </div>
        )
        :
        (<h5 className="standardTitle">Проект не знайдено!</h5>);

    return IsLoaded ? RETURN_PROJECT :
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
