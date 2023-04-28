import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Class = (props) => {

    const navigate = useNavigate();
    const backNavigate = e => {
        navigate('/Account');
    };

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


