import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Card, Col, Form, Input, Button, Switch, message, Select } from 'antd'
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth'
import { updateLocale } from 'moment';

class UpdateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: props.roomId || '',
            room_number: '',
            room_location: '',
            roomname: '',
            room_location_img: []
        }
    }

    async componentDidMount() {
        console.log("roomid", this.state.roomId)
        let { room_number, room_location } = this.state;
        let response = await axios.get(`${config.API_DOMAIN}/eventrooms/list?id=${this.state.roomId}`)
        let dataRoom = response.data
        if (dataRoom && dataRoom[0]) {
            dataRoom = dataRoom[0];
            room_number = dataRoom.room_number;
            room_location = dataRoom.room_location;
        }
        this.setState({ room_number, room_location })
    }

    onNumberChange = event => {
        this.setState({ room_number: event.target.value })
    }

    onLocationChange = event => {
        this.setState({ room_location: event.target.value })
    }

    onImgChange = event => {
        this.setState({ room_location_img: event.target.value })
    }

    handleSubmit = () => {
        event.preventDefault()
        const element = new FormData();
        element.append('id', this.state.roomId);
        element.append('room_number', this.state.room_number);
        element.append('room_location', this.state.room_location);
        if (document.getElementById('room_location_img').value) {
            const ins = document.getElementById('room_location_img').files.length;
            for (let x = 0; x < ins; x++) {
                element.append("room_location_img", document.getElementById('room_location_img').files[x]);
            }
        }
        axios.post(`${config.API_DOMAIN}/eventrooms/customUpdate`, element, {
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
        console.log('roomId: ', this.state.roomId);
        const { room_number, room_location } = this.state
        return (
            <div style={{ padding: '0px 30px 0px 30px' }}>
                <Form id="room-form" onSubmit={this.handleSubmit}>
                    <Form.Item label="Өрөөний нэр">
                        <Input type='text' name="room_number"
                            value={room_number} onChange={this.onNumberChange} style={{ width: "80%" }} />
                    </Form.Item>

                    <Form.Item label="Өрөөний байршил">
                        <Input type='text' name="room_location"
                            value={room_location} onChange={this.onLocationChange} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item label="Өрөөний байршлын зураг">
                        <input id='room_location_img' type='file'
                            onChange={this.onImgChange} name="room_location_img" style={{ width: "60%", padding: '0px' }} />
                    </Form.Item>

                    <Form.Item >
                        <Input type='hidden' name="event" style={{ width: "40%" }}
                            value={this.state.eventId} ></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary" style={{ width: "40%" }}>Save</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default UpdateRoom