import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { Input, Form, Button, Card, Col, Row, Table, Select, Upload, Icon, Tabs, message } from 'antd';
import config from '../../config'
import Auth from '../../lib/auth'
import axios from 'axios';
import Api from './api'

const {Option} = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
    },
};
const customItemLayout = {
    wrapperCol: {
        xs: { span: 12, offset: 6 },
        sm: { span: 12, offset: 6 },
    },
};

class AddProgramSpeaker extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId || '',
            speakerId: props.speakerId || '',
            roleType: [],
            programList: [],


            role: '',
            event_program: '',
            
            eventProgram: []
        }
    }

    componentDidMount(){
        this.fetchRoles();
        this.fetchPrograms();
    }

    fetchRoles = async() =>{
        let json = await Api.fetchRoles();
        if (json && !json.code) {
            this.setState({ roleType: json });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchRoles'}
                </div>
            );
        }
    }

    fetchPrograms= async() =>{
        let json = await Api.fetchProgramsByEvent({event: this.state.eventId})
        if (json && !json.code) {
            this.setState({ programList: json });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchRoles'}
                </div>
            );
        }
    }

    handleRoleChange = value =>{
        this.setState({...this.state, role: value})
    }

    handleProgramChange = value =>{
        this.setState({...this.state, event_program: value})
    }

    handleSubmit = async(values)=>{
        const speakerRole={
            role: values.role,
            event_program: values.event_program,
            event_speaker: this.state.speakerId
        }
        let json = await Api.insertSpeakerProgram(speakerRole)

        if(json && !json.code){
            this.props.onSuccess()
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'insert binding'}
                </div>
            );
        }
        // let selectedProgramData =[];
        // let res =  await axios.get(`${config.API_DOMAIN}/eventprograms`);
        // let programdata = res.data;

        // if((programdata || []).length > 0){
        //     selectedProgramData = programdata.filter((data) => {
        //         return data.title == this.state.event_program
        //         }
        //     )
        //     console.log("selectedOneEvent: ", selectedProgramData[0])
        // }
        // this.setState({ eventProgram: selectedProgramData[0] || {} })

        // const speakerRole={
        //     role: this.state.role,
        //     event_program: this.state.eventProgram.id,
        //     event_speaker: this.state.speakerId
        // }
        // console.log("data", speakerRole)
        // fetch(`${config.API_DOMAIN}/eventprogramspeakers`, {
        //     method: 'POST',
        //     headers: new Headers({
        //         'Content-Type': 'application/json'
        //     }),
        //     body: JSON.stringify(speakerRole),
        // })
        // .then(function (response) {
        //     if (response.status == 200) {
        //         message.success('Амжилттай');
        //     } else {
        //         message.error('Алдаа гарлаа');
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    }

    render(){
        return(
            <div style={{ background: '#ECECEC', padding: '10px 20px' }}>
                 <Row gutter={16}>
                    {/* <Col span={12}> */}
                        <Card bordered={false} style={{ width: '100%'}}>
                          <Form onFinish={this.handleSubmit} {...formItemLayout}>
                            {/* <Input type="hidden" name="event_speaker" value={this.state.speakerId} /> */}
                            <Form.Item label="Role" name="role" valuePropName="value">
                                <Select  >
                                    {this.state.roleType.map((role) => {
                                        return <Option key={role} value={role} >{role}</Option>;
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Илтгэл"  name="event_program" valuePropName="value">
                                <Select 
                                    showSearch
                                    optionFilterProp="children" >
                                    {this.state.programList.map((program) => {
                                        return <Option key={program.id} value={program.id} >{program.title}</Option>;
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item {...customItemLayout}>
                                <Button htmlType="submit" type="primary" >Нэмэх</Button>
                            </Form.Item>
                          </Form>
                        </Card>
                    {/* </Col> */}
                </Row>
            </div>
        )
    }
}
export default AddProgramSpeaker