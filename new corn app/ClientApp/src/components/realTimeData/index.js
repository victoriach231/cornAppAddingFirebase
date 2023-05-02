import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref as sRef, onValue, getDatabase } from 'firebase/database';
import { UserAuth } from '../../context/AuthContext';
import goToClassPage from '../Account'
import { Table } from 'react-bootstrap';

const db = getDatabase();

const RealTimeData = () => {
    const [tableData, setTableData] = useState([]);
    const userTable = UserAuth();
    const navigate = useNavigate();

    // get all classes user is enrolled in and refresh when classes added
    useEffect(() => {
        const dbRef = sRef(db, 'users/' + userTable.user.uid + '/classesEnrolled/');

        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data });
                console.log(data);
            });
            setTableData(records);
        });
    }, []);


    // navigate to the class page
    const goToClassPage = () => {
        try {
            navigate('/class');
            console.log('went to class')
        } catch (e) {
            console.log(e.message);
        }

    };


    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Class Name</th>
                </tr>
            </thead>

            <tbody>
                {tableData.map((rowdata, index) => {
                    return (
                        <tr>
                            <td onClick={goToClassPage}>{index}</td>
                            <td onClick={goToClassPage}>{rowdata.key}</td>
                            <td onClick={goToClassPage}> {rowdata.data.email}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    );
}
export default RealTimeData;
