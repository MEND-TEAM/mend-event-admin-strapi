import React from 'react';
import { connect } from 'react-redux';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';
import { Tabs } from 'antd';
import Event from './Event';
import EventQues from './Question';

const { TabPane } = Tabs;

class EventInfo extends React.Component {

    constructor(props) {
        super(props);
        // console.log('props, id: ', this.props.id);
    }

    save = (event) => {
        event.preventDefault();
        const element = document.getElementById('form');
        axios.post(`${config.API_DOMAIN}/events/customCreate`, new FormData(element), {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        return (
            <Tabs id="form" onSubmit={this.save} style={{ marginLeft: '70px' }}>
                <TabPane tab="General Info" key="1">
                    <Event  />
                </TabPane>
                <TabPane tab="Programs" key="2"></TabPane>
                <TabPane tab="Participants" key="3"></TabPane>
                <TabPane tab="Speakers" key="4"></TabPane>
                <TabPane tab="Poll" key="5"></TabPane>
                <TabPane tab="Questions" key="6">
                    <Question id={this.props.id} />
                </TabPane>
                <TabPane tab="Exhibition" key="7"></TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let id = ((ownProps.match || {}).params || {}).id || ''
    return {
        id,
    }
}

export default connect(mapStateToProps)(EventInfo);