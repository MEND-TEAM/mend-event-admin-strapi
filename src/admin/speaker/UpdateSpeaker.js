import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Card, Col, Form, Input, Button, Switch, message } from 'antd'
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth'

const { TextArea } = Input;
class UpdateSpeaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            speakerId: props.speakerId || '',
            name: '',
            position: '',
            description: '',
            picture: [],
            isFeatured: false,
        }
    }

    async componentDidMount() {
        console.log("speakerid", this.state.speakerId)
        let { name, position, description } = this.state
        let response = await axios.get(`${config.API_DOMAIN}/eventspeakers/list?id=${this.state.speakerId}`)
        let dataSpeaker = response.data
        if (dataSpeaker && dataSpeaker[0]) {
            dataSpeaker = dataSpeaker[0];
            name = dataSpeaker.name;
            position = dataSpeaker.position;
            description = dataSpeaker.description;
        }
        this.setState({ name, position, description })
    }

    onNameChange = event => {
        this.setState({ name: event.target.value })
    }

    onPosChange = event => {
        this.setState({ position: event.target.value })
    }

    onDescChange = event => {
        this.setState({ description: event.target.value })
    }

    onSwitchChange = value => {
        this.setState({ checked: value })
        console.log("check", this.state.checked)
    }

    onPictureChange = event => {
        this.setState({ picture: event.target.value })
    }

    handleSubmit = async () => {
        event.preventDefault();
        const element = new FormData();
        element.append('name', this.state.name);
        element.append('position', this.state.position);
        element.append('description', this.state.description);
        element.append('isfeatured', this.state.isFeatured);
        element.append('id', this.state.speakerId);
        if (document.getElementById('picture').value) {
            const ins = document.getElementById('picture').files.length;
            for (let x = 0; x < ins; x++) {
                element.append("picture", document.getElementById('picture').files[x]);
            }
        }
        axios.post(`${config.API_DOMAIN}/events/customUpdate`, element, {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
            .then(function (response) {
                console.log('update response: ', response);
                if (response.status == 200 && response.data.result) {
                    message.success('Амжилттай шинэчиллээ');
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        console.log('speakerId: ', this.props.speakerId);
        return (
            <div className="event-list" style={{ padding: '0px 30px 30px 30px' }}>
                <Form id="speaker-form" onSubmit={this.handleSubmit} >
                    <Form.Item label="Илтгэгчийн нэр">
                        <Input type='text' name="name" value={this.state.name}
                            onChange={this.onNameChange} style={{ width: "60%" }} />
                    </Form.Item>

                    <Form.Item label="Илтгэгчийн албан тушаал">
                        <Input type='text' name="position" value={this.state.position}
                            onChange={this.onPosChange} style={{ width: "60%" }} />
                    </Form.Item>

                    <div className="speaker-switch">
                        <Form.Item label="Илтгэгчийн isFeatured">
                            <Switch name="isfeatured" defaultChecked onChange={this.onSwitchChange} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Илтгэгчийн мэдээлэл">
                        <TextArea name="description" value={this.state.description}
                            onChange={this.onDescChange} rows="7" />
                    </Form.Item>

                    <Form.Item label="Илтгэгчийн зураг" >
                        <input id="picture" type="file" name={this.state.picture}
                            onChange={this.onPictureChange} style={{ width: "60%" }} />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary" >Save</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default UpdateSpeaker;