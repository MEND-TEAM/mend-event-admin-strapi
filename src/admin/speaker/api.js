import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {
    static fetchSpeakerCount = (params) => {
        const {...rest} = params;
        let url = domain + '/eventspeakers/count'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        console.log('url', url)
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchSpeakerListByEvent = (params) => {
        const {...rest} = params
        let url = domain + '/eventspeakers/list'
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

    static fetchProgramsBySpeaker = (params) => {
        const {...rest} = params
        let url = domain + '/eventprogramspeakers'
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
        let url = domain + '/eventspeakers/customCreate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        })
    }

    static updateSpeaker = (formData) => {
        
        let url = domain + '/eventspeakers/customUpdate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        })
    }

    static removeSpeaker = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventspeakers/customDelete/'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify({id})
        })
    }

    static fetchSpeakerById = (params) => {
        const {id, ...rest} = params;
        let url = domain + '/eventspeakers/' + id
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
}

export default Api;