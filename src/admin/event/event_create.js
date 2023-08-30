import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DatePicker, Input, Form, Button, Upload, message, Icon, Row, Col, Switch } from 'antd';
import moment from 'moment';
import axios from 'axios';
import config from '../../config';
import Auth from '../../lib/auth';
import Api from './api';

const { TextArea } = Input;

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

class EventCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          creating: false
        };
    }
    formRef = React.createRef();
    componentDidMount() {
        this.formRef.current.setFieldsValue({
            open_time: moment(),
            close_time: moment(),
        });
    }

    async onFinish (values) {
      this.setState({creating: true})
      const formData = new FormData();
        //TODO: validate
        let params = {
            name: values.event_name,
            general_info: values.general_info,
            location_desc: values.location_desc,
            open_time: values.open_time.format(),
            close_time: values.close_time.format(),
        };
        for (const name in params) {
          formData.append(name, params[name]);
      }
      let json = await Api.createEvent(formData)
        console.log('json', json)
        if(json && json.result){
            this.setState({creating: false})
            this.formRef.current.resetFields()
            this.props.onSuccess()
            // this.fetchEventDetails()
        } else {
            message.error(<div>Алдаа гарав.<br />{json.message || ''}</div>)
            this.setState({creating: false})
        }
    }

    render() {
        

        return (
            <div className="container">
                <Form id="create-event-form" ref={this.formRef} {...formItemLayout} onFinish={(vals) => this.onFinish(vals)}>
                    <Form.Item label="Эвэнтийн нэр" name="event_name">
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="Эхлэх өдөр" name="open_time">
                        <DatePicker format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                    <Form.Item label="Дуусах өдөр" name="close_time">
                        <DatePicker format="YYYY-MM-DD HH:mm" />
                    </Form.Item>

                    <Form.Item label="Дэлгэрэнгүй мэдээлэл" name="general_info">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Байршил" name="location_desc">
                        <Input type="text" />
                    </Form.Item>
                    {/* <Form.Item label="Байршлын зураг" name="location">
                        <Input type="file" style={{ width: '60%', padding: '0px' }} />
                    </Form.Item>
                    <Form.Item label="Барилгын зураг">
                        <Input type="file" name="building" style={{ width: '60%', padding: '0px' }} />
                    </Form.Item>
                    <Form.Item label="Хөтөлбөртэй холбоотой зураг">
                        <Input type="file" name="banner" style={{ width: '60%', padding: '0px' }} />
                    </Form.Item> */}

                    <Form.Item {...customItemLayout}>
                        <Button htmlType="submit" type="primary" style={{ width: '150px' }} disabled={this.state.creating} loading={this.state.creating}>
                            Хадгалах
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default EventCreate;
