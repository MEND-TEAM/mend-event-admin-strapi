import { Button, Checkbox, Col, Divider, Form, Input, message, Row, Select, Space, Table } from 'antd';
import axios from 'axios';
import React from 'react';
import config from '../../config';
import Auth from '../../lib/auth';
import Api from './api';

const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 }
    }
};

const customItemLayout = {
    wrapperCol: {
        xs: { span: 6, offset: 18 },
        sm: { span: 6, offset: 18 }
    }
};

class PaymentAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUser: {},
            paymentTypes: [],
            eventPackages: [],
            totalAmount: 0,


            event: '',
            paymentTypeList: [],
            firstName: '',
            lastName: '',
            phone: '',
            eventUserId: '',
            disabled: true,
            amount: '',
            paymentType: '',
            selectedEvent: this.props.eventId,
            msg: ''
        };

        this.formRef = React.createRef();
    }

    async componentDidMount() {
        this.fetchPaymentTypes()
    }

    fetchPaymentTypes = async () => {
        let json = await Api.fetchPaymentTypes()
        if(json && !json.code){
            this.setState({paymentTypes: json})
        } else {
            message.error( json.message || 'Алдаа гарав. fetchPaymentTypes' );
        }
    }

    onSearchUser = async (value) => {
        let params = {phone_contains: value, _limit: 50}
        let json = await Api.fetchMembers(params)
        console.log('onSearchUser', json)
        if(json && json.code == 1000){
            let userList = json.list.map((u) => {return {phone: u.phone, id: u.id, fname: u.firstname, lname: u.lastname, register: u.register_number}})
            this.setState({users: userList})
        } else {
            message.error( json.message || 'Алдаа гарав. onSearchUser' );
        }
    }

    onSearchFocus = () => {
        this.onSearchUser()
    }

    selectUser = (value) => {
        console.log('selectUser', value)
        let member = this.state.users.find(u => u.id == value)
        this.setState({selectedUser: member})
    }

    fetchPackages = async (event) => {
        let json = await Api.fetchPackages({event: event})
        if(json && !json.code){
            this.setState({eventPackages: json})
        } else {
            message.error( json.message || 'Алдаа гарав. fetch packages');
        }
    }

    eventOnChange = (value) => {
        console.log('eventOnChange', value)
        this.fetchPackages(value)
    }

    onChangeChecks = (values) => {
        console.log('onChangeChecks', values)
        let total = 0;
        console.log('packages', this.state.eventPackages)
        for(let i=0; i < values.length; i++){
            total += Number.parseInt((this.state.eventPackages.find((p)=> {return p.id == values[i]}) || {}).amount)
        }
        this.setState({totalAmount: total})
    }



    savePayment = async (values) => {
        console.log('save', values)
        // values: {
        //     event: 215
        //     member: 2
        //     packages: (2) [2, 8]
        //     payment_type: "Бэлэн бус"
        // }

        let json = await Api.savePayment(values)
        console.log('save', json)
        if(json && !json.code) {
            this.props.onSuccess()
        } else {
            message.error( json.message || 'Алдаа гарав. savePayment'); 
        }
    };

    render() {
        const {
            users,
            selectedUser, 
            paymentTypes,
            eventPackages,
            totalAmount,
        } = this.state;

        return (
            <div style={{ padding: '20px 10px 10px 10px' }}>
                <Form ref={this.formRef} {...formItemLayout} onFinish={this.savePayment}>
                    <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label='Эвэнт сонгох' name='event' valuePropName="value" rules={[{
                                    required: true,
                                    message: 'Эвэнт сонгоно уу', }]}>
                                    <Select
                                        placeholder="Эвэнт хайх"
                                        style={{ width: '100' }}
                                        showSearch
                                        onSearch={this.props.onSearchEvent}
                                        onFocus={this.props.onFocus}
                                        optionFilterProp="children"
                                        onChange={this.eventOnChange}
                                        >
                                        {this.props.events.map(item => {
                                            return (
                                                <Select.Option key={item.id} id={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item label='Гишүүн сонгох' name='member' valuePropName="value" rules={[{
                                    required: true,
                                    message: 'Гишүүн сонгоно уу', }]}>
                                    <Select
                                        placeholder="Утасны дугаар"
                                        style={{ width: '200px' }}
                                        showSearch
                                        onSearch={this.onSearchUser}
                                        onFocus={this.onSearchFocus}
                                        optionFilterProp="children"
                                        onChange={this.selectUser}
                                        >
                                        {users.map(item => {
                                            return (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.phone}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="packages" label="Багц сонгох" valuePropName="value" rules={[{
                                    required: true,
                                    message: 'Багц сонгоно уу', }]}>
                                    <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeChecks}>
                                        { eventPackages.map((i)=>{
                                            return  <Row gutter={4}>
                                                        <Col span={8}>
                                                            <Checkbox value={i.id}>{i.amount}</Checkbox>
                                                        </Col>
                                                        <Col span={16}>
                                                            {i.name}
                                                        </Col>
                                                    </Row>

                                            })}
                                    </Checkbox.Group>
                                </Form.Item>
                                
                            </Col>
                            <Col span={8} offset={4}>
                                <Row gutter={24} justify="end" style={{marginBottom: '30px',marginTop: '60px'}}>
                                        <Col span={6}><strong>Утас:</strong></Col><Col span={16} offset={2}>{selectedUser.id ? selectedUser.phone : '.......'}</Col>
                                        <Col span={6}><strong>Овог:</strong></Col><Col span={16} offset={2}>{selectedUser.id ? selectedUser.lname : '.......'}</Col>
                                        <Col span={6}><strong>Нэр:</strong></Col><Col span={16} offset={2}>{selectedUser.id ? selectedUser.fname : '.......'}</Col>
                                        <Col span={6}><strong>Регистер:</strong></Col><Col span={16} offset={2}>{selectedUser.id ? selectedUser.register : '.......'}</Col>
                                        <Col span={6}><strong>Нийт төлөх:</strong></Col><Col span={16} offset={2}><strong>{totalAmount || 0}</strong></Col>
                                </Row>
                                
                                <Form.Item name="payment_type" rules={[{
                                    required: true,
                                    message: 'Төлбөрийн хэлбэр сонгоно уу', }]}>
                                    <Select placeholder="Төлбөрийн хэлбэр" style={{ width: '200px' }} >
                                        {paymentTypes.map(item => {
                                            return (
                                                <Select.Option key={item} value={item}>
                                                    {item}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item {...customItemLayout}>
                                    <Button type="primary" htmlType="submit">Нэмэх</Button>
                                </Form.Item>
                            </Col>
                    </Row>
                </Form> 
            </div>
        );
    }
}

export default PaymentAdd;
