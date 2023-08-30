import store from '../store';
export const EVENT_CHANGED = 'EVENT_CHANGED';
export const PROGRAM_CHANGED = 'PROGRAM_CHANGED';
export const SET_PROGRAM_LIST = 'SET_PROGRAM_LIST';
export const SET_EVENT_LIST = 'SET_EVENT_LIST';
export const NEW_ATTENDANCE = 'NEW_ATTENDANCE';
export const NEW_QUESTION = 'NEW_QUESTION';
export const LIKE_QUESTION = 'LIKE_QUESTION';
export const POLL = 'POLL';


export const eventChanged = event => ({
    type: EVENT_CHANGED,
    event
});

export const programChanged = program => ({
    type: PROGRAM_CHANGED,
    program
});

export const setProgramList = programList => ({
    type: SET_PROGRAM_LIST,
    programList
});

export const setEventList = eventList => ({
    type: SET_EVENT_LIST,
    eventList
});

export const newAttendance = attendance => ({
    type: NEW_ATTENDANCE,
    attendance
});

export const newQuestion = newQuestions => ({
    type: NEW_QUESTION,
    newQuestions
});

export const likeQuestion = questionLikes => ({
    type: LIKE_QUESTION,
    questionLikes
});

export const updatePoll = (poll) => {
    console.log('redux: ', poll);
    return {
        type: POLL,
        poll
    };
};
