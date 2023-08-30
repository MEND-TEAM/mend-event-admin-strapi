import { Card } from 'antd';
import React from 'react';

import withUser from './hoc/withUser';
import Auth from '../lib/auth'

class Home extends React.Component {
    constructor(props) {
        super(props)
        let confirm = Auth.getConfirm()
        this.state = {
            user: confirm.user
        }
    }

    render() {
        const {user} = this.state
        return(            
            <Card>
                Admin home
                <div>Welcome <strong>{user.username}</strong></div>
            </Card>
        )
    }
}


// export default withUser(Home)
export default Home