import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {

    static countFaqs = (params) => {
        const {...rest} = params
        let url = domain + '/eventfaqs/count'
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

    static fetchFaqs = (params) => {
        const {...rest} = params;
        let url = domain + '/eventfaqs';
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
    };

    static createFaq = (formData) => {
        let url = domain + '/eventfaqs/customCreate';
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }

    static updateFaq = (formData) => {
        let url = domain + '/eventfaqs/customUpdate'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: formData
        });
    }

    static removeQuestion = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventfaqs/' + id
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            }
        });
    }
    
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

}

export default Api;