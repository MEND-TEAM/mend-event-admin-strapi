import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {
    
    static countStaffs = (params) => {
        const {...rest} = params
        let url = domain + '/eventstaffs/count'
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

    static fetchStaffList = (params) => {
        const {...rest} = params
        let url = domain + '/eventstaffs/list'
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
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static createUser = (params)=> {
        const {...rest} = params
        let url = domain + '/eventstaffs/customCreate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static updateStaff = (params) => {
        const {...rest} = params
        let url = domain + '/eventstaffs/customUpdate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }
    
}

export default Api;