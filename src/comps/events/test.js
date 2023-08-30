import React, { Component } from 'react';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

class Test extends React.Component {

    save = (event) => {
        event.preventDefault();
        const element = document.getElementById('form');
        axios.post(`${config.API_DOMAIN}/eventparticipants/customCreate`, new FormData(element), {
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
            <div>
                <form id="form" onSubmit={this.save}>
                    name: <input type="text" name="name"/> <br/>
                    description: <input type="text" name="description"/> <br/>
                    meta: <input type="text" name="meta"/> <br/>
                    event: <input type="text" name="event"/> <br/>
                    participant_type: <input type="text" name="participant_type"/> <br/>
                    banner: <input type="file" name="banner"/> <br/>
                    <input type="submit" value="save"/>
                </form>
            </div>
        );
    }
}

export default Test;