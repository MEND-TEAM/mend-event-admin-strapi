import React from 'react';
import { Input, Form, Button, Card, Col, Row, Table, Select, Checkbox, message } from 'antd';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';

const {Option} = Select

class CreateParticipant extends React.Component{
    constructor(props){
        super(props);
        this.state={
            eventId : props.eventId || '',
            participantTypeList: [],
            participant_type: ''
        }
    }

    async componentDidMount (){
        let participantTypeList = [];
        let response = await fetch(`${config.API_DOMAIN}/eventparticipants/types`)
        if (response.ok) {
            participantTypeList = await response.json();
            console.log("participantType", participantTypeList)
        }

        this.setState({
            loading: false,
            participantTypeList
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const element = document.getElementById('participant-form');
        axios.post(`${config.API_DOMAIN}/eventparticipants/customCreate`, new FormData(element), {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
            .then(function (response) {
                message.success("Successfully inserted")
                console.log("event-response", response.data);
            })
            .catch(function (error) {
                message.error("Error")
                console.log(error);
            });
      }
    
    onSelectChange = value =>{
        this.setState({ participant_type: value})
        console.log("check", this.state.participant_type)
    }

    render(){
        return(
            <div className="event-list">
                <Form id="participant-form" onSubmit={this.handleSubmit} >
        
                    <div className="participant-name">
                        <Form.Item  label="Оролцогчын нэр">
                            <Input type='text' name="name" style={{ width: "60%" }}/>
                        </Form.Item>
                    </div>

                    <div className="participant-desc">
                        <Form.Item label="Оролцогчын мэдээлэл">
                            <Input type='text' name="description" style={{ width: "60%" }}/>
                        </Form.Item>
                    </div>

                    <div className="participant-meta">
                        <Form.Item label="Оролцогчын meta">
                            <Input type='text' name="meta" style={{ width: "60%" }}/>
                        </Form.Item>
                    </div>

                    <div className="participant-type">
                        <Form.Item  label="Оролцогчын төрөл">
                            <Select name="participant_type" value={this.state.participant_type} style={{ width: '60%' }} onChange={this.onSelectChange}>
                                {this.state.participantTypeList.map((type) => {
                                    return <Option value={type}>{type}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="participant-img">
                        <Form.Item label="Хөтөлбөртэй холбоотой зураг" >
                            <input type="file" name="banner" style={{ width: "60%" }}/>
                        </Form.Item>
                    </div>

                    <div className="participant-event-id">
                        <Form.Item >
                            <Input type='hidden' name="event" style={{ width: "60%" }}
                            value={this.state.eventId}></Input>
                        </Form.Item>
                    </div>
                    
                    <div className="saveButton">
                            <Button htmlType="submit" type="primary" >Save</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
export default CreateParticipant;