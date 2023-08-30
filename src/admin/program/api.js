import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';
import { rest } from 'lodash';

const domain = config.API_DOMAIN;

class Api {

    static fetchProgramsCount = (params) => {
        const {filter, ...rest} = params;
        let url = domain + '/eventprograms/count';
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        if (filter) {
            url += '&title_contains=' + filter
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchProgramsByEvent = (params) => {
        const {filter, ...rest} = params;
        let url = domain + '/eventprograms';
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        if (filter) {
            url += '&title_contains=' + filter
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchProgram = (params) => {
        const {programId, ...rest} = params;
        let url = domain + '/eventprograms/' + programId;
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchTypesProgram = () => {
        let url = domain + '/eventprograms/types'
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchRoomsEvent = (params) => {
        const {...rest} = params;
        let url = domain + '/eventrooms'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static updateProgramDetails = (params) => {
        const {programId, formData} = params;
        let url = domain + '/eventprograms/' + programId

        return fetchWithTimeout(url, {
            method: 'PUT',
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }
    static createProgram = (params) => {
        const {formData} = params;
        let url = domain + '/eventprograms'

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }

    static deleteProgram = (params) => {
        const {id} = params
        let url = domain + '/eventprograms/' + id
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchSpeakersByEvent =(params) => {
        const {...rest} = params
        let url  = domain + '/eventspeakers/list'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchRoles = (params) => {
        const {...rest} = params
        let url = domain + '/eventprogramspeakers/types'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchSpeakersByProgram = (params) => {
        const {...rest} = params
        let url = domain + '/eventprogramspeakers/list'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static insertSpeakerProgram = (params) => {
        const {...rest} = params
        let url = domain + '/eventprogramspeakers'

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static removeSpeakerFromProgram = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventprogramspeakers/' + id
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }
    static countQuestions = (params) => {
        const {...rest} = params
        let url = domain + '/eventquestions/count'
        if (rest){
            url += '?' + querystring.stringify(rest)
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchQuestions = (params) => {
        const {...rest} = params
        let url = domain + '/eventquestions/list'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    } 

    static createQuestion = (params) => {
        const {...rest} = params
        let url = domain + '/eventquestions'
        // if (rest) {
        //     url += '?' + querystring.stringify(rest);
        // }
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static removeQuestion = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventquestions/' + id
        // if (rest) {
        //     url += '?' + querystring.stringify(rest);
        // }
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static createPoll = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/customCreate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static deletePoll = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/customDelete'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static fetchPolls = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/list'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchPollOptions = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolloptions/list'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }
}

export default Api;