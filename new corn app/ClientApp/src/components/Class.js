import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

const Class = (props) => {

    return (
        <div>
            <h1>Class Name</h1>
            <Button>Start Session</Button>

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

        </div>
    );
};
export default Class;


