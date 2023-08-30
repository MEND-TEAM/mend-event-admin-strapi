import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {

    // static countFaqs = (params) => {
    //     const {...rest} = params
    //     let url = domain + '/eventfaqs/count'
    //     if (rest) {
    //         url += '?' + querystring.stringify(rest);
    //     }
    //     return fetchWithTimeout(url, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: 'Bearer ' + Auth.getToken(),
    //         },
    //     });
    // }

    static fetchPackages = (params) => {
        const {...rest} = params;
        let url = domain + '/eventpackages';
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

    static createPackage = (params) => {
        const {...rest} = params
        let url = domain + '/eventpackages'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static removePackage = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventpackages/' + id
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static fetchProgramsByPackage = (params) => {
        const {...rest} = params
        let url = domain + '/eventpackageprograms/idlist'
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

    static savePackagePrograms = (params) => {
        const {...rest} = params
        let url = domain + '/eventpackageprograms/add'
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