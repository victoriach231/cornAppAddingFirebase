import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { newClass } from './realTimeData/index';
import ListGroup from 'react-bootstrap/ListGroup';
import { getDatabase, ref, child, get, onValue } from "firebase/database";

const sessionFunctions = require('./EndOfSessionFunctions');
// TODO import selected question set from class page
const db = getDatabase();

const InstructorSessionView = () => {
    // keep track of students in session in a list
    const [studentsInSession, setStudentsInSession] = useState([]);

    // get the id of the currently selected class
    const chosenClass = newClass;

    // toggle side bar that shows students currently in the session
    const [showStudentsBar, setShowStudentsBar] = useState(false);
    const handleStudentBarClose = () => setShowStudentsBar(false);
    const handleStudentBarShow = () => setShowStudentsBar(true);

    

    // grab the students that are in the session
    useEffect(() => {
        const studentsRef = ref(db, 'classes/' + chosenClass + '/sessionActive/activeStudents');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            if (data != null) {
                const idsOfStudentsInSession = Object.keys(data);
                const allUsers = get(child(ref(db), 'users/')).then((snapshot) => {
                    if (snapshot.exists()) {


                        let studentNameList = [];


                        idsOfStudentsInSession.forEach(element => studentNameList.push(snapshot.val()[element]['name']));


                        console.log(studentNameList);
                        setStudentsInSession(studentNameList);

                        return snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                });

            }
        });
    }, []);
    

    return (
        <div>
            <p> hi welcome to instructor view of session</p>
            <br />

            <Button variant="primary" onClick={handleStudentBarShow}>
                See students in the session
            </Button>

            <Offcanvas show={showStudentsBar} onHide={handleStudentBarClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Students in the session:</Offcanvas.Title>
                </Offcanvas.Header>
                <div>
                    <Offcanvas.Body>
                        <h6>Number of students joined: {studentsInSession.length}</h6>
                        <ListGroup>
                            {studentsInSession.map((element, index) => {
                                return (
                                    <div key={index}>
                                        <ListGroup.Item>{element}</ListGroup.Item>
                                    </div>
                                );
                            })}

                        </ListGroup>
                        

                            
                    </Offcanvas.Body>
                </div>
                
            </Offcanvas>




            <br />

            <button onClick={() => { sessionFunctions.download(["a", "b"], "filee") }}>Download CSV</button>
        </div>
    );
};
export default InstructorSessionView;

// will the curr count number of students in sidebar change in real time??? 
