import querystring from 'query-string';
import config from '../../config';
import Auth from '../../lib/auth';
import fetchWithTimeout from '../../lib/fetchWithTimeout';

const domain = config.API_DOMAIN;

class Api {

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
}

export default Api