import querystring from 'query-string';
import config from '../../config';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import Auth from '../../lib/auth';

const domain = config.API_DOMAIN;

class Api {

    
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
    
    static countInvoiceList = (params) => {
        const {...rest} = params
        let url = domain + '/eventinvoices/count'
        if(rest) {
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
    static fetchInvoiceList = (params) => {
        const {...rest} = params
        let url = domain + '/eventinvoices/users'
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

    static fetchMembers = (params) => {
        const {...rest} = params
        let url = domain + '/doctors/list'
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

    static fetchPaymentTypes = () => {
        let url = domain + '/eventpayments/types'
        return fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            }
        })
    }

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

    static savePayment = (params) => {
        const {...rest} = params;
        let url = domain + '/eventpayments/customPaid'
        return fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static cancelPayment = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventpayments/' + id
        return fetchWithTimeout(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
            body: JSON.stringify(rest)
        });
    }

    static removeInvoice = (params) => {
        const {id, ...rest} = params
        let url = domain + '/eventinvoices/' + id
        return fetchWithTimeout(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + Auth.getToken(),
            },
        });
    }

    static addPayment = (params) => {
        const {...rest} = params
        let url = domain + '/eventpayments/add'
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