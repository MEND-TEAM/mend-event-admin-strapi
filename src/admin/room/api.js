import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {

    static fetchRooms = (params) => {
        const {...rest} = params;
        let url = domain + '/eventrooms/list'
        if(rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchRoomInfo = (params) => {
        const {...rest} = params;
        let url = domain + '/eventrooms/list'
        if(rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static createRoom = (params) => {
        const {formData} = params;
        let url = domain + '/eventrooms/customCreate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }

    static updateRoom = (params) => {
        const {roomId, formData} = params;
        let url = domain + '/eventrooms/customUpdate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }

    static deleteRoom = (params) => {
        const {roomId} = params
        let url = domain + '/eventrooms/customDelete'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify({roomId})
        });
    }

    // static fetchProgramsCount = (params) => {
    //     const {filter, ...rest} = params;
    //     let url = domain + '/eventprograms/count';
    //     if (rest) {
    //         url += '?' + querystring.stringify(rest);
    //     }
    //     if (filter) {
    //         url += '&title_contains=' + filter
    //     }
    //     return fetchWithTimeout(url, {
    //         method: 'GET',
    //         headers: {
    //             'Content-type': 'application/json',
    //             Authorization: 'Bearer ' + Auth.getToken(),
    //         },
    //     });
    // }

}

export default Api;