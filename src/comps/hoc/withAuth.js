import React, { Component } from 'react';

import AuthContext from '../../context/AuthContext';
import Auth from '../../lib/auth';

/* A higher order component is frequently written as a function that returns a class. */
const withAuth = (AuthComponent) => {

    return class AuthWrapped extends Component {
        constructor(props) {
            super(props)
            
            this.state = {
                confirm: null,
                loaded: false
            };
        }

        /* In the componentDidmount, we would want to do a couple of important tasks in order to verify the current users authentication status
            prior to granting them enterance into the app. */
        componentDidMount() {
            if (!Auth.isLogged()) {
                // history.replace("/admin/auth/login");
               
                    
                window.location.replace('/admin/auth/login')
            
            } else {
                /* Try to get confirmation message from the Auth helper. */
                try {
                    const confirm = Auth.getConfirm();
                    // console.log("confirmation is:", confirm);
                    this.setState({confirm, loaded: true});
                } catch (err) {
                    console.log(err);
                    Auth.logout();
                    // history.replace("/admin/auth/login");
                    window.location.replace('/admin/auth/login')
                }
            }
        }

        render() {
            if (this.state.loaded == true) {
                if (this.state.confirm) {                    
                    return (
                        <AuthContext.Provider value={{
                            auth: Auth,
                            confirm: this.state.confirm
                        }}>
                            {
                                <AuthComponent {...this.props}/>
                            }
                        </AuthContext.Provider>                        
                    );
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
}

export default withAuth