import { Card } from 'antd';
import React from 'react';

class NotFound extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return(
            <Card>
                Page not found
            </Card>
        )
    }
}

export default NotFound