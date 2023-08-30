import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {Row, Card, Col, Form, Image, Input, Button, Switch, message, Select, Upload} from 'antd'
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth'
import Api from './api';

const {Option} = Select;
const domain = config.API_DOMAIN;
const mimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'] //accepted mime types
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
const UploadImage = props => {
    const { bannerImg, onChange, onRemove } = props;
    const pprops = {
        onRemove: (file) => {
            onRemove(file)
        },
        beforeUpload: (file) => {
            //if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
            if (mimes.indexOf(file.type) < 0) {
                message.error(`png, jpg, jpeg, webp, gif форматууд зөвшөөрөгдөнө`);
                return false
            }
            onChange([file]);
            return false;
        },
        fileList: bannerImg,
    };
    return (<div className="">
        <Form.Item label="Лого">
            <Upload multiple={false} {...pprops} style={{ width: '30%', padding: '0px' }}> <Button>Зураг сонгох</Button> </Upload>
        </Form.Item>
    </div>);
};

class ModalParticipant extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId || 0,
            participantId: props.participantId || 0,
            purpose: props.purpose || '',
            bannerImg: [],
            imgUrl: '',
            participantTypeList: [],
        }
        this.formRef = React.createRef()
    }

    async componentDidMount(){
        console.log('parti modal purpose', this.state.purpose)
        this.fetchParticipantTypes();
    }

    fetchParticipantTypes = async () => {
        let json = await Api.fetchParticipantTypes()
        console.log('types', json)
        if(json && !json.code){
            this.setState({participantTypeList: json})
            if(this.state.purpose == 'update'){
                this.fetchParticipant()
            }
        } else {
            message.error(json.message || 'Алдаа гарлаа. fetch types'); 
        }
    }

    fetchParticipant = async () => {
        let json = await Api.fetchParticipant({id: this.state.participantId})
        console.log('participant', json)
        if(json && !json.code) {
            if(json.length > 0){
                let participant = json[0]
                this.formRef.current.setFieldsValue({
                    name: participant.name,
                    description: participant.description,
                    meta: participant.meta,
                    type: participant.participant_type
                })
                this.setState({imgUrl: domain + participant.banner.url})
            } else {
                message.error(json.message || 'Participant not found'); 
            }
        } else {
            message.error(json.message || 'Алдаа гарлаа. fetch paricipants'); 
        }
    }

    onChange = (e) => {
        this.setState({
            bannerImg: e || []
        });
    };

    onRemove = (e) => {
        this.setState({
            bannerImg: []
        });
    }

    
    handleSubmit = async (values)=>{
        const formData = new FormData();
        let params = {
            name: values.name,
            description: values.description,
            meta: values.meta,
            participant_type: values.type,
        }

        for (const name in params) {
            formData.append(name, params[name]);
        }
        if(this.state.bannerImg.length > 0){
            formData.append('banner', this.state.bannerImg[0])
        }
        let json = ''
        if(this.state.participantId) { // update participant
            formData.append('id',this.state.participantId)
            json = await Api.updateParticipant(formData)
        } else { //create new participant
            formData.append('event',this.state.eventId)
            json = await Api.createSpeaker(formData);
        }
        console.log('update', json)

        if(json && !json.code){
            this.props.onSuccess();
        } else {
            message.error(json.message || 'Алдаа гарлаа. did not create or update Participant'); 
        }


        // const element = new FormData();
        // element.append('name', this.state.name);
        // element.append('description', this.state.description);
        // element.append('meta', this.state.meta);
        // element.append('participant_type', this.state.participant_type);
        // element.append('id', this.state.participantId);
        // if(document.getElementById('banner').value){
        //     const ins = document.getElementById('banner').files.length;
        //     for (let x = 0; x < ins; x++) {
        //         element.append("banner", document.getElementById('banner').files[x]);
        //     }            
        // } 
        // axios.post(`${config.API_DOMAIN}/events/customUpdate`, element, {
        //     headers: {
        //         'Authorization': 'Bearer ' + Auth.getToken()
        //     }
        // })
        // .then(function (response) {
        //     console.log('update response: ', response);
        //     if (response.status == 200 && response.data.result) {
        //         message.success('Амжилттай шинэчиллээ');
        //     } else {
        //         message.error('Алдаа гарлаа');
        //     }
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    }

    render(){
        return (
            <Row gutter={16}>
                <Col span={24}>
                        <div className="event-list">
                            <Form ref={this.formRef} onFinish={this.handleSubmit} {...formItemLayout}>
                                <Form.Item  label="Байгууллагын нэр" name="name">
                                    <Input style={{ width: "100%" }}/>
                                </Form.Item>

                                <Form.Item label="Мэдээлэл" name="description">
                                    <Input.TextArea row={6} style={{ width: "100%" }}/>
                                </Form.Item>

                                <Form.Item label="Оролцогчын мэта" name="meta">
                                    <Input type='text' style={{ width: "60%" }}/>
                                </Form.Item>

                                <Form.Item  label="Оролцох хэлбэр" name="type" valuePropName="value">
                                    <Select style={{ width: '60%' }} >
                                        {this.state.participantTypeList.map((type) => {
                                            return <Option key={type} value={type}>{type}</Option>;
                                        })}
                                    </Select>
                                </Form.Item>
                                {this.state.imgUrl && 
                                    <Form.Item {...customItemLayout}>
                                        <Image width={200} src={this.state.imgUrl}/>
                                    </Form.Item>}
                                <UploadImage bannerImg={this.state.bannerImg} onChange={(ev) => {this.onChange(ev)}} onRemove={(ev) => this.onRemove(ev)}/>
                                
                                <Form.Item {...customItemLayout}>
                                    <Button htmlType="submit" type="primary" >Хадгалах</Button>
                                </Form.Item>
                            </Form>
                        </div>
                </Col>
            </Row>
        )
    }
}
export default ModalParticipant;