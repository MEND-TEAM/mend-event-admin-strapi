import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import React, { createRef } from 'react';
import Api from './api';

const { Option } = Select;

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hospitals: [],
            professionTypes: [],
            professions: [],
            universities: [],
            eventList: [],
            paymentTypes: [],
            disabled: false          
        };

        this.formRef = createRef();
    }

    componentDidMount() {
        if (this.props.userId) {
            this.fetchUser();
        }
    }

    phoneOnChange = event => {
        this.setState({ phone: event.target.value });
    };

    usernameOnChange = event => {
        this.setState({ username: event.target.value });
    };

    passwordOnChange = event => {
        this.setState({ password: event.target.value });
    };

    fetchUser = async () => {
        let json = await Api.fetchUser({ id: this.props.userId });

        if (json && !json.code && Array.isArray(json) && json.length > 0) {
            json = json[0];
            this.formRef.current.setFieldsValue({
                firstname: json.firstname || '',
                lastname: json.lastname || '',
                phone: json.phone || '',
                register_number: json.register_number || ''
            });
        } else {
            message.error(
                <div>
                    Алдаа гарав!<div>{json.message || ''}</div>
                </div>
            );
        }
    };

    save = async values => {

        let userId = this.props.userId || 0;
        this.setState({ disabled: true });
        if (userId) {
            let json = await Api.updateUser({ ...values, userId });

            this.setState({ disabled: false });

            if (json && !json.code && json.result) {
                this.props.onChanged({ type: 'updated' });
            } else {
                message.error(
                    <div>
                        Алдаа гарав!<div>{json.message || ''}</div>
                    </div>
                );
            }
        } else {
            let formData = new FormData();
            Object.keys(values).map(key => {
                formData.append(key, values[key] || '');
            });
            formData.append('username', values['phone'])
            let user = JSON.parse(localStorage.getItem('user'))
            let create_by = user.username + ':' + localStorage.getItem('role');
            formData.append('is_confirm', 1)

            formData.append('create_by', create_by)

            let json = await Api.createUser(formData);
            this.setState({ disabled: false });
            if (json && !json.code && json.result) {
                this.props.onChanged({ type: 'created' });
            } else {
                message.error(
                    <div>
                        Алдаа гарав!<div>{json.message || ''}</div>
                    </div>
                );
            }
        }
    };

    render() {
        const {
            hospitals,
            universities,
            professionTypes,
            professions,
            username,
            password,
            phone
        } = this.state;

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
        return (
           
                <Form
                    ref={this.formRef}
                    onFinish={this.save}
                    {...formItemLayout}>
                    
                        
                            
                                
                                    <div className="">
                                        <Form.Item label="Нэр" name="firstname">
                                            <Input
                                                type="text"                                                
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="">
                                        <Form.Item label="Овог" name="lastname">
                                            <Input
                                                type="text"
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="">
                                        <Form.Item label="Утас" name="phone">
                                            <Input
                                                type="text"
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="">
                                        <Form.Item
                                            label="Регистер"
                                            name="register_number">
                                            <Input
                                                type="text"
                                                style={{                                                  
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* <div className="">
                                        <Form.Item label="Зураг">
                                            <input
                                                type="file"
                                                name="avatar"
                                                style={{
                                                    width: '70%',
                                                    padding: '0px'
                                                }}
                                            />
                                        </Form.Item>
                                    </div> */}
                                
                            
                        
                        {/* <Col span={8}>
                            <Card title="Мэргэжил" bordered={false}>
                                <div className="">
                                    <Form.Item
                                        label="Сургууль"
                                        name="universities"
                                        valuePropName="value">
                                        <Select style={{ width: '60%' }}>
                                            {universities.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="">
                                    <Form.Item
                                        label="Мэргэжил"
                                        name="profession_type"
                                        valuePropName="value">
                                        <Select style={{ width: '60%' }}>
                                            {professionTypes.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item
                                        label="Мэргэшил"
                                        name="profession"
                                        valuePropName="value">
                                        <Select style={{ width: '60%' }}>
                                            {professions.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item
                                        label="Эмнэлэг"
                                        name="hospital"
                                        valuePropName="value">
                                        <Select style={{ width: '60%' }}>
                                            {hospitals.map(item => {
                                                return (
                                                    <Option value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </Card>
                        </Col> */}
                        {/* {(this.props.userId || 0) == 0 && (
                            <Col span={8}>
                                <Card title="Логин" bordered={false}>
                                    <div className="">
                                        <Form.Item
                                            label="Нэвтрэх нэр"
                                            name="username">
                                            <Input
                                                type="text"
                                                onChange={this.usernameOnChange}
                                                style={{ width: '60%' }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Нууц үг"
                                            hasFeedback
                                            name="password">
                                            <Input
                                                onChange={this.passwordOnChange}
                                                style={{ width: '60%' }}
                                            />
                                        </Form.Item>
                                    </div>
                                </Card>
                            </Col>
                        )} */}
                    
                    <div className="saveButton">
                        <Form.Item {...customItemLayout}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                disabled={this.state.disabled}>
                                Хадгалах
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            
        );
    }
}

export default CreateUser;
