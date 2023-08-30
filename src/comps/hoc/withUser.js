import React from 'react';

import { AuthConsumer } from '../../context/AuthContext';

const withUser = (Component) => {
    
    return (props) => {
        return (
            <AuthConsumer>
                { ({auth, confirm}) => { 
                    return <Component {...props} auth={auth} confirm={confirm}/>
                }}
            </AuthConsumer>
        )
    }
}

export default withUser