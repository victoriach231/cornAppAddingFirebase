import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { newClass } from './realTimeData/index';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { getDatabase, ref, child, get, onValue, update, remove, set} from "firebase/database";
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const Class = (props) => {
    // get the id of the currently selected class
    const chosenClass = newClass;
    const db = getDatabase();

    const navigate = useNavigate();

    // keep track of students in class in a list
    const [studentsInClass, setStudentsInClass] = useState([]);

    const [studentNameIDMap, setStudentNameIDMap] = useState();

    const [selectedStudent, setSelectedStudent] = useState();

    // keep track of class tas
    const [tasInClass, setTasInClass] = useState([]);

    const [classInstructor, setClassInstructor] = useState();

    // toggle side bar that shows students currently in the session~
    const [showStudentsBar, setShowStudentsBar] = useState(false);
    const handleStudentBarClose = () => setShowStudentsBar(false);
    const handleStudentBarShow = () => setShowStudentsBar(true);

    const backNavigate = e => {
        navigate('/account');
    };

    const getCurrClassID = () => {
        console.log(chosenClass);
    };

    const goToSessionPage = () => {
        navigate('/session-instructor-view');
    };

    const goToQuestionEdit = () => {
        navigate('/edit-questions')
    }

    // start/end a session
    const startSession = () => {
        get(child(ref(getDatabase()), 'classes/' + chosenClass + '/sessionActive')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val()['sessionActive']);
                set(ref(getDatabase(), 'classes/' + chosenClass + '/sessionActive'), {

                    sessionActive: !snapshot.val()['sessionActive'],
                    currentQuestion: 0,
                    timerToggled: false
                });

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    // grab the students that are in the class
    useEffect(() => {

        const studentsRef = ref(getDatabase(), 'classes/' + chosenClass + '/students');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            
            // accounts for empty student list
            if (data === null || data.length === 0) {
                setStudentsInClass([]);
            }

            if (data) {
                const idsOfStudentsInClass = Object.keys(data);
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {

                        let studentNameList = [];

                        idsOfStudentsInClass.forEach(element => studentNameList.push(snapshot.val()[element]['name']));

                        const studentIdStudentNameMap = new Map();
                        idsOfStudentsInClass.forEach(element => studentIdStudentNameMap.set(snapshot.val()[element]['name'], element));
                        setStudentNameIDMap(studentIdStudentNameMap);

                        setStudentsInClass(studentNameList);
                        return snapshot.val();
                    } else {
                        console.log("No data available");
                        setStudentNameIDMap(new Map());
                    }
                });

            } else {
                console.log('were here');
            }
 
        });

        // grab current tas in class
        const taRef = ref(getDatabase(), 'classes/' + chosenClass + '/tas');
        onValue(taRef, (snapshot) => {
            const data = snapshot.val();

            if (data != null) {
                const idsOfTasInClass = Object.keys(data);
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {

                        let taNameList = [];

                        idsOfTasInClass.forEach(element => taNameList.push(snapshot.val()[element]['name']));

                        setTasInClass(taNameList);
                        return snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                });
            }
        });

        // grab current instructor/creator of class
        const instructorRef = ref(db, 'classes/' + chosenClass + '/admin');

        onValue(instructorRef, (snapshot) => {
            const data = snapshot.val();

            if (data != null) {
                const idsOfInstructorInClass = data;
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {

                        let instructorNameList = [];
                        console.log(idsOfInstructorInClass);
                        idsOfInstructorInClass.forEach(element => instructorNameList.push(snapshot.val()[element]['name']));

                        setClassInstructor(instructorNameList);
                        return snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                });
            }
        });


    }, []);

    const makeStudentTA = () => {
        let studentName = window.selectedStudentG;
        if (studentNameIDMap) {
            const studentID = studentNameIDMap.get(studentName);

                get(child(ref(getDatabase()), 'classes/' + chosenClass)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());

                    // add student to ta list
                    const newTA = {
                        ta: studentID,
                    };

                    const updates = {};
                    updates['classes/' + chosenClass + '/tas/' + studentID] = newTA;

                    update(ref(getDatabase()), updates).then(() => {
                        // remove that student from the students list
                        remove(ref(db, 'classes/' + chosenClass + '/students/' + studentID)).then(() => {
                            console.log("deleted");
                        });
                    });

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    };

    // set up ta creation popup
    const [showAddTA, setAddTA] = useState(false);
    const handleClose = () => setAddTA(false);
    const handleShow = () => setAddTA(true);

    return (
        <div>
            <div class='header'>
                <div class='corner'>
                    <button onClick={backNavigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="arrow-back" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>

                    </button>
                </div>
                <h1 class='title'>Class Name</h1>

            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question Set</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>0</td>
                        <td>Intro To Potatoes</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Carrot Science</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Celery Economics</td>
                    </tr>
                </tbody>
            </Table>
            <p>Hi welcome to your class</p>
            <br />

            <Button variant="primary" onClick={handleStudentBarShow}>
                See students in the class
            </Button>

            <Modal show={showAddTA} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new ta!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Make this student a TA?</h6>
                    <mbtn>
                        <button class="m" onClick={() => { makeStudentTA() }}>OK</button>
                    </mbtn>
                </Modal.Body>

            </Modal>

            <Offcanvas show={showStudentsBar} onHide={handleStudentBarClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Class roster:</Offcanvas.Title>
                </Offcanvas.Header>
                <div>
                    <Offcanvas.Body>
                        <h6>Instructor: {classInstructor}</h6>
                        <br />
                        <h6>Number of TAs: {tasInClass.length}</h6>

                        <ListGroup>
                            {tasInClass.map((element, index) => {
                                return (
                                    <div key={index}>
                                        <ListGroup.Item>{element}</ListGroup.Item>
                                    </div>
                                );
                            })}

                        </ListGroup>
                        <br />
                        <h6>Number of students joined: {studentsInClass.length}</h6>

                        <ListGroup>
                            {studentsInClass.map((element, index) => {
                                return (
                                    <div key={index}>
                                        <ListGroup.Item action onClick={() => { window.selectedStudentG = element; handleShow() }}>{element}</ListGroup.Item>
                                    </div>
                                );
                            })}
                        </ListGroup>
                    </Offcanvas.Body>
                </div>
            </Offcanvas>

            <br />
            <button onClick={getCurrClassID}>
                click to see class id

            </button>

            <br />
            <button onClick={startSession}>Start session</button>

            <br />
            <button onClick={goToSessionPage}>Visit session page</button>

            <br />
            <button onClick={goToQuestionEdit}>Go To Question Set Edit Page</button>

        </div>
    );
};
export default Class;


