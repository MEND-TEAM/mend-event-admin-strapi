import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { Input, Form, Button, Card, Col, Row, Table, Select, Upload, Icon, Tabs, message } from 'antd';
import config from '../../config'
import Auth from '../../lib/auth'
import axios from 'axios';

const {Option} = Select;

class UpdateProgramSpeaker extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            programList: [],
            roleType: [],
            role: '',
            event_program: '',
            eventId: props.eventId || '',
            id: props.id || '',
            speakerId: props.speakerId || '',
            programId: props.programId || '',
            eventProgram: []
        }
    }

    async componentDidMount(){
        console.log(this.state.id, this.state.speakerId, this.state.programId);
        let {event_program} = this.state;
        let response = await axios.get(`${config.API_DOMAIN}/eventprograms/list?id=${this.state.programId}`)
        let dataProgram = response.data
        console.log("check", dataProgram)
        if(dataProgram && dataProgram[0]){
            dataProgram = dataProgram[0];
            event_program = dataProgram.title;
        }
        this.setState({ event_program })

        this.fetchRoleType();
        this.fetchProgram();
    }

    fetchRoleType = async() =>{
        let roleType = [];
        let response = await axios.get(`${config.API_DOMAIN}/eventprogramspeakers/types`)
        roleType=response.data;
        // console.log("check", roleType);

        this.setState({
            loading: false,
            roleType
        });
    }

    fetchProgram= async() =>{
        let programList=[]
        let response = await axios.get(`${config.API_DOMAIN}/eventprograms/list?event=${this.state.eventId}`)
        programList= response.data;
        // console.log(programList)

        this.setState({
            loading: false, 
            programList,
        })
    }

    handleRoleChange = value =>{
        this.setState({...this.state, role: value})
    }

    handleProgramChange = value =>{
        this.setState({...this.state, event_program: value})
    }

    handleSubmit = async() =>{
        event.preventDefault();
        let selectedprogram=[]
        let response= await axios.get(`${config.API_DOMAIN}/eventprograms/list?title=${this.state.event_program}`)
        let programdata = response.data;
        console.log("id", programdata[0].id)

        const data ={
            event_program: programdata[0].id,
            event_speaker: this.state.speakerId,
            role: this.state.role
        }
        response = axios.put(`${config.API_DOMAIN}/eventprogramspeakers/${this.state.id}`, data, {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
        .then(function (response) {
            if (response.status == 200) {
                message.success('Амжилттай шинэчиллээ');
            } else {
                message.error('Алдаа гарлаа');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render(){
        return(
            <div style={{ background: '#ECECEC', padding: '30px', marginRight: '60px' }}>
                 <Row gutter={16}>
                    {/* <Col span={12}> */}
                        <Card title="Event Participant" bordered={false}>
                          <Form id="program-speaker-role" onSubmit={this.handleSubmit} >
                            <Input type="hidden" name="event_speaker" value={this.state.speakerId} />
                            <Form.Item label="Илтгэл">
                                <Select name="event_program"  value={this.state.event_program} style={{ width: '60%' }} 
                                    onChange={this.handleProgramChange}
                                    showSearch
                                    optionFilterProp="children" 
                                    >
                                    {this.state.programList.map((program) => {
                                        return <Option value={program.title} >{program.title}</Option>;
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Role ">
                                <Select name="role" value={this.state.role} style={{ width: '60%' }} 
                                    onChange={this.handleRoleChange}
                                    showSearch
                                    optionFilterProp="children"
                                    >
                                    {this.state.roleType.map((role) => {
                                        return <Option value={role} >{role}</Option>;
                                    })}
                                </Select>
                            </Form.Item>
                            <Button htmlType="submit" type="primary" >Save</Button>
                          </Form>
                        </Card>
                    {/* </Col> */}
                </Row>
            </div>
        )
    }
}
export default UpdateProgramSpeaker