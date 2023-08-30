import config from '../config';
import Auth from '../lib/auth';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
    newAttendance,
    newQuestion,
    updatePoll,
    likeQuestion
} from '../redux/app/actions';

const background = store => {
    // console.log('location: ', window.location);
    if (window.location.pathname == '/operator/attendance/screen') {
        return;
    }

    if (window.location.pathname == '/operator/question/screen') {
        return;
    }

    if (window.location.pathname == '/operator/poll/screen') {
        return;
    }

    const socket = io(config.API_DOMAIN);

    socket.on('connect', async () => {
        socket.emit('auth', { authorization: 'Bearer ' + Auth.getToken() });

        socket.on('attendance', function(attendance) {
            console.log('attendance message is recieved : ', attendance);
            store.dispatch(newAttendance(attendance));
        });

        socket.on('new-question', function(question) {
            try {
                console.log('attendance message is recieved : ', question);
                const newQuestions = store.getState().app.newQuestions;
                const result = newQuestions.find(q => {
                    if (q.id == question.id) return true;
                });
                if (!result) {
                    newQuestions.push(question);
                    store.dispatch(newQuestion(newQuestions));
                }
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('like-question', function(like) {
            const { questionLikes } = store.getState().app;
            questionLikes.push(like);
            store.dispatch(likeQuestion([...questionLikes]));
        });

        socket.on('poll', function(poll) {
            console.log('attendance message is recieved : ', poll);
            try {
                const state = store.getState();
                if (
                    poll &&
                    poll.pollId &&
                    state.app.poll &&
                    state.app.poll.id == poll.pollId
                ) {
                    let pollOption = state.app.poll.pollOptions.find(option => {
                        if (option.id == poll.pollOptionId) return true;
                    });
                    if (pollOption) {
                        pollOption.pollCount++;
                        store.dispatch(updatePoll({ ...state.app.poll }));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('disconnect', () => {
            console.error('disconnected');
        });
    });
};

export default background;
