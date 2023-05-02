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
                console.log(data.class);
                //console.log((sRef(db, 'classes/' + data.class + '/')).childSnapshot);
            });
            setTableData(records);
        });

        /*
        tableData.forEach(function (record) {
            const dbRef1 = sRef(db, 'classes/' + record.childSnapshot.val() + '/');
            console.log(record.childSnapshot.val());
            onValue(dbRef1, (snapshot) => {
                let classNames = [];
                snapshot.forEach(childSnapshot => {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    classNames.push({ "key": keyName, "data": data });
                    console.log(data);
                });
                setTableData(classNames);
            });
        })*/

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
                            <td onClick={goToClassPage(rowdata.data.class)}>{index}</td>
                            <td onClick={goToClassPage(rowdata.data.class)}>{rowdata.key}</td>
                            <td onClick={goToClassPage(rowdata.data.class)}> {rowdata.data.email}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    );
}
export default RealTimeData;
