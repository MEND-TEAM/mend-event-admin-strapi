import querystring from 'query-string';
import config from '../../config';
import Auth from '../../lib/auth';
import fetchWithTimeout from '../../lib/fetchWithTimeout';

const domain = config.API_DOMAIN;

class Api {

    static createUser = formData => {
        let url = domain + '/doctors/customCreate';

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: formData
        });
    };

    static updateUser = (params) => {
        let url = domain + '/doctors/updateGeneralInfo';

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    };

    static fetchUser = (params) => {
        const {...rest} = params
        let url = domain + '/doctors';
        
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        });
    };

    static fetchUserCount = (params) => {
        const { ...rest} = params;
        let url = domain + '/doctors/count';
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

    static fetchUserList = (params) => {
        const {...rest} = params;
        let url = domain + '/doctors/list';
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
