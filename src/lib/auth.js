import decode from 'jwt-decode'
import config from '../config'

class Auth {
    login = (username, password) => {
        return this.fetch(`${config.API_DOMAIN}/auth/local`, {
            method: "POST",
            body: JSON.stringify({identifier: username, password})
        }).then(res => {
            console.log('res=========', res)
            if (res.jwt) {
                const role = res.user.role.name;
                if (role == 'Authenticated' || role == 'operator') {
                    this.setToken(res.jwt); // Setting the token in localStorage                
                    this.setUser(JSON.stringify(res.user)) ;
                    this.setRole(res.user.role.name);                           
                    return Promise.resolve(res);
                } else {
                    return Promise.reject({message: "Хандах эрхгүй байна"});    
                }

            } else {
                return Promise.reject({message: res.message});
            }
        });
    }

    isLogged = () => {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // Getting token from localstorage
        const role = this.getRole();
        return !!token && !this.isTokenExpired(token) && (role == 'Authenticated' || role == 'operator'); // handwaiving here
    }

    isTokenExpired = (token) => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // Checking if token is expired.
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log("expired check failed!");
            return false;
        }
    };

    setRole= (role) => {
        localStorage.setItem("role", role);
    }
    
    setToken = (token) => {
        // Saves user token to localStorage
        localStorage.setItem("token", token);
    };

    setUser = (user) => {
        // Saves user token to localStorage
        localStorage.setItem("user", user);
    };
    
    getToken = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem("token");
    };

    getRole = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem("role");
    };    

    getUser = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem("user");
    };
    
    logout = () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    };
    
    getConfirm = () => {
        // Using jwt-decode npm package to decode the token
        let token = decode(this.getToken());
        let user = JSON.parse(this.getUser());
        let role = this.getRole();
        console.log("Recieved answer!");
        return {token, user, role};
    };
    
    fetch = (url, options ={}) => {
        // performs api calls sending the required authentication headers
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.isLogged()) {
            headers["Authorization"] = "Bearer " + this.getToken();
        }
    
        return fetch(url, {
            headers,
            mode: 'cors',
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json());
    };
    
    _checkStatus = response => {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            // Success status lies between 200 to 300
            return response;
        } else if (response.status == 400) {
            return response
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
            // let error = new Error(response.message || 'Алдаа гарав!')
            // throw error
        }
    };
}

export default new Auth()