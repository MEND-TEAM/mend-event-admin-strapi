import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {

    static fetchParticipantTypes = (params) => {
        const {...rest} = params;
        let url = domain + '/eventparticipants/types';
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


    static fetchParticipants = (params) => {
        const {...rest} = params;
        let url = domain + '/eventparticipants/list';
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

    static countParticipants = (params) => {
        const {...rest} = params;
        let url = domain + '/eventparticipants/count';
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

    static fetchParticipant = (params) => {
        const {...rest} = params;
        let url = domain + '/eventparticipants/';
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

    static createSpeaker = (formData) => {
        let url = domain + '/eventparticipants/customCreate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }
    static updateParticipant = (formData) => {
        let url = domain + '/eventparticipants/customUpdate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }

    static removeParticipant = (params) => {
        const {id , ...rest}= params
        let url = domain + '/eventparticipants/' + id
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    
}

export default Api;
