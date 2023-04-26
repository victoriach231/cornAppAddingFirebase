﻿const calculateScore = require('./Session');

test('test multiple choice and T/F session answers', () => {
    const sessionAnswers = ["A", "C", "B", "T", "F"];
    const userAnswers = ["A", "D", "B", "T", "T"];
    expect(calculateScore(userAnswers, sessionAnswers)).toBe(3);

});

test('test multiple choice and T/F session answers - user skipped question', () => {
    const sessionAnswers = ["A", "C", "B"];
    const userAnswers = ["A", "", "B"];
    expect(calculateScore(userAnswers, sessionAnswers)).toBe(2);

});

test('test free response session answers', () => {
    const sessionAnswers = ["A", "", "B"];
    const userAnswers = ["A", "testing free response", "B"];
    expect(calculateScore(userAnswers, sessionAnswers)).toBe(2);

});

test('test user didnt answer any questions', () => {
    const sessionAnswers = ["A", "", "B"];
    const userAnswers = ["", "", ""];
    expect(calculateScore(userAnswers, sessionAnswers)).toBe(0);

});

test('test user answered all questions incorrectly', () => {
    const sessionAnswers = ["A", "C", "B"];
    const userAnswers = ["B", "A", "C"];
    expect(calculateScore(userAnswers, sessionAnswers)).toBe(0);

});

test('test user answered only free response questions', () => {
    const sessionAnswers = ["", "", ""];
    const userAnswers = ["test", "free", "responses"];
    expect(calculateScore(userAnswers, sessionAnswers)).toBe(0);

});
