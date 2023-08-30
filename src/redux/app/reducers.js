import {
    EVENT_CHANGED, PROGRAM_CHANGED, SET_EVENT_LIST, SET_PROGRAM_LIST,
    NEW_ATTENDANCE, NEW_QUESTION, POLL, LIKE_QUESTION
} from './actions';
const reducers = (state = {}, action) => {
    switch (action.type) {
        case EVENT_CHANGED:
            return {
                ...state,
                selectedEvent: action.event
            };
        case PROGRAM_CHANGED:
            return {
                ...state,
                selectedProgram: action.program
            };
        case SET_EVENT_LIST:
            return {
                ...state,
                eventList: action.eventList
            };
        case SET_PROGRAM_LIST:
            return {
                ...state,
                programList: action.programList
            };
        case NEW_ATTENDANCE:
            return {
                ...state,
                attendance: action.attendance
            };

        case NEW_QUESTION:
            return {
                ...state,
                newQuestions: action.newQuestions
            };
        case LIKE_QUESTION:
            return {
                ...state,
                questionLikes: action.questionLikes
            };
        case POLL:
            return {
                ...state,
                poll: action.poll
            };
        default:
            return state;
    }
};

export default reducers;