import React from 'react';
import { ref as sRef, onValue, getDatabase } from 'firebase/database';
import { Table } from 'react-bootstrap';

const db = getDatabase();

export class RealTimeData extends React.Component {
    constructor() {
        super();
        this.state = {
            tableData: []
        }
    }


    componentDidMount() {
        const dbRef = sRef(db, "classes/");

        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data });
            });
            this.setState({ tableData: records });
        });
    }


    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Class Name</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.tableData.map((rowdata, index) => {
                        return (
                            <tr>
                                <td>{index}</td>
                                <td>{rowdata.key}</td>
                                <td>{rowdata.data.className}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }
}

