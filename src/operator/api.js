import querystring from 'query-string';
import config from '../config';
import Auth from '../lib/auth';
import fetchWithTimeout from '../lib/fetchWithTimeout';

const domain = config.API_DOMAIN;

class Api {

    static fetchEventPackageList = (params) => {
        const {eventId} = params
        let url = domain + '/eventpackages/list?eventId=' + eventId;

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchEventPackageProgram = (params) => {
        const {packageId} = params
        let url = domain + '/eventpackageprograms/listbypackage?packageId=' + packageId;

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchQuestionList = (params) => {
        const {...rest} = params
        let url = domain + '/eventquestions/vote';
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static deleteQuestion = (params) => {
        
        let url = domain + '/eventquestions/customDelete';
        

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static saveQuestion = (params) => {
        
        let url = domain + '/eventquestions/customSave';
        

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static processQuestion = (params) => {
        
        let url = domain + '/eventquestions/customProcess';
        

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static updateQuestionAnswered = (params) => {
        
        let url = domain + '/eventquestions/customAnswered';
        

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

    static updateConfirmedQuestionOrder = (params) => {
        
        let url = domain + '/eventquestions/customOrder';
        

        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(params)
        });
    }

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

    static fetchPollList = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/list';
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchPollScreen = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/screen'
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchPollOptions = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolloptions/list';
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }

        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static startPoll = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/start';
      
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(rest)
        });
    }

    static finishPoll = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/finish';
      
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(rest)
        });
    }

    static deletePoll = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/customDelete';
      
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(rest)
        });
    }

    static savePoll = (params) => {
        const {...rest} = params
        let url = domain + '/eventpolls/customSave';
      
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify(rest)
        });
    }

    static fetchPollResult = (params) => {
        const {...rest} = params
        let url = domain + '/eventpollreports/summary';
        if (rest) {
            url += '?' + querystring.stringify(rest);
        }
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                Authorization: 'Bearer ' + Auth.getToken()
            }
        });
    }

    static fetchAttendanceScreen = (params) => {
        const {...rest} = params
        let url = domain + '/eventattendancebuckets/screen'
        if (rest) {
            url += '?' + querystring.stringify(rest);
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