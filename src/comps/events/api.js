import querystring from 'query-string';
import config from '../../config';
import Auth from '../../lib/auth';
import fetchWithTimeout from '../../lib/fetchWithTimeout';

const domain = config.API_DOMAIN;

class Api {

    static fetchEventList = () => {
        let url = domain + '/events/list';

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchProgramList = (params) => {
        const {eventId} = params
        let url = domain + '/eventprograms/list?event=' + eventId;

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchEventProgramAttendant = (params) => {
        let url = domain + '/eventattendences/customList';
        if (params) {
            url += '?' + querystring.stringify(params);
        }

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static addEventProgramAttendant = (params) => {
        let url = domain + '/eventattendences/customReg';
       
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static searchUser = (params) => {
        let url = domain + '/events/searchUserByPhone';
        if (params) {
            url += '?' + querystring.stringify(params);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

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

    static fetchEventAttendantBucket = (params) => {
        let url = domain + '/eventattendancebuckets/customList';
        if (params) {
            url += '?' + querystring.stringify(params);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static deleteEventAttendantBucket = (params) => {
        const {id} = params
        let url = domain + '/eventattendancebuckets/' + id;
        
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static createEventAttendantBucket = (params) => {
      
        let url = domain + '/eventattendancebuckets/customCreate'
        
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static startBucket = (params) => {
      
        let url = domain + '/eventattendancebuckets/start'
        
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static endBucket = (params) => {
      
        let url = domain + '/eventattendancebuckets/end'
        
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static fetchBucketUser = (params) => {
        let url = domain + '/eventattendancebuckets/userList';
        if (params) {
            url += '?' + querystring.stringify(params);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }
}

export default Api