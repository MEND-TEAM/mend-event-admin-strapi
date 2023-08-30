import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {
    // static fetchActions = (params) => {
    //     const { signal, ...rest } = params;
    //     let url = domain + '/api/common/action';
    //     if (rest) {
    //         url += '?' + querystring.stringify(rest);
    //     }
    //     return fetchWithTimeout(url, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'GET',
    //         mode: 'cors',
    //         credentials: 'include',
    //         signal,
    //     });
    // };

    static fetchEventListCount = (params) => {
        const {...rest} = params;
        let url = domain + '/events/count';
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

    static fetchEventList = (params) => {
        const {...rest} = params
        let url = domain + '/events'
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

    static fetchEventDetails = (params) => {
        const {eventId} = params
        if(!eventId){
            return {code: 1001, message: 'Invalid params'}
        }
        let url = domain + '/events/' + eventId
        // if (rest) {
        //     url += '?' + querystring.stringify(rest);
        // }
        console.log('url', url)
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static updateEventDetails = (formData) => {
        
        let url = domain + '/events/customUpdate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        })
    }
    static createEvent = (formData) => {
        
        let url = domain + '/events/customCreate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        })
    }

}

export default Api;