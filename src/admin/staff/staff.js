import React, { Fragment, useState, useEffect } from 'react';
import { Avatar, Button, Card, Col, Divider, Form, Icon, Input, List, message, Modal, Popconfirm, Pagination, Row, Select, Space, Switch, Table } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeInvisibleOutlined, EyeTwoTone, DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import config from '../../config';

import Api from './api';

const _limit = 15;
class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId || '',
            staffs: [],
            page: 1,
            total: 0,
            search: '',
            events: [],
            selectedEvent: '',
            roleId: '',
            confirmed: true
        };
    }

    componentDidMount() {
        this.fetchStaffCount({name: ''})
        this.fetchStaffList({page: 1, name: ''})
    }

    fetchStaffCount = async ({name = '', event = '', roleId = '', confirmed = true}) => {
        let params = {}
        if(name){
            params = {...params, name}
        }
        if(event){
            params = {...params, event}
        }
        if(roleId){
            params = {...params, roleId}
        }
        if(confirmed){
            params = {...params, confirmed: 'true'}
        }
        let json = await Api.countStaffs(params)
        if((json && !json.code && !(json.result === false)) || json == 0 ){
            this.setState({total: json})
        } else {
            message.error( json.message || 'Алдаа гарав. count staffs');
        }
    }

    fetchStaffList = async ({page=1, name='', event = '', roleId = '', confirmed = true}) => {
        let params = {page, max: _limit}
        if(name){
            params = {...params, name}
        }
        if(event){
            params = {...params, event}
        }
        if(roleId){
            params = {...params, roleId}
        }
        if(confirmed){
            params = {...params, confirmed: 'true'}
        }
        let json = await Api.fetchStaffList(params)
        console.log('staffList', json)
        if(json && !json.code && !(json.result === false)){
            this.setState({staffs: json})
        } else {
            message.error( json.message || 'Алдаа гарав. fetch staff list');
        }
        
    }

    fetchEvents = async (search = '') =>{
        let params = {_sort: 'id:desc', is_draft: 'false', _limit: 50} //hailtiin ehnii 50 utgiig
        if(search){
            params = {...params, name_contains: search}
        }
        let json = await Api.fetchEventList(params)
        // console.log('fetchEvents', json)
        if (json.code == 1000) {
            let events = json.list.map((e)=>{return {id: e.id, name: e.name}})
            this.setState({ loading: false, events: events });
            
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'Алдаа гарав. fetchEvents'}
                </div>
            );
        }
    }

    showModal = () => {
        this.setState({showModal: true, purpose: 'create'})
    }
    hideModal = () => {
        this.setState({showModal: false})
    }

    createStaff = () => {
        return (
            <Modal visible={true} width='40%' title="Шинэ хэрэглэгч үүсгэх" footer={false} onCancel={this.hideModal}>
                <NewStaff onSuccess={this.onSuccess} staff={this.state.purpose == 'update' ? this.state.selectedStaff : ''}/>
            </Modal>
        );
    }

    onSuccess = () => {
        this.setState({showModal: false})
        //refresh
    }
    searchBy = (val) => {
        this.setState({page: 1, search: val})
        this.fetchStaffCount({name: val, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: this.state.confirmed})
        this.fetchStaffList({page: 1, name: val, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: this.state.confirmed})
    }

    onPageChange = (page) => {
        this.setState({page: page})
        this.fetchStaffCount({name: this.state.search, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: this.state.confirmed})
        this.fetchStaffList({page: page, name: this.state.search, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: this.state.confirmed})
    }

    onSearchEvent = (value) => {
        this.fetchEvents(value)
    }
    onFocus = () => {
        this.fetchEvents('')
    }

    eventOnChange = value => {
        this.setState({selectedEvent: value, page: 1})
        this.fetchStaffCount({name: this.state.search, event: value, roleId: this.state.roleId, confirmed: this.state.confirmed})
        this.fetchStaffList({page: 1, name: this.state.search, event: value, roleId: this.state.roleId, confirmed: this.state.confirmed})
    };

    onRoleChange = value => {
        this.setState({roleId: value})
        this.fetchStaffCount({name: this.state.search, event: this.state.selectedEvent, roleId: value, confirmed: this.state.confirmed})
        this.fetchStaffList({page: 1, name: this.state.search, event: this.state.selectedEvent, roleId: value, confirmed: this.state.confirmed})
    }

    onToggle = checked => {
        this.setState({confirmed: checked})
        this.fetchStaffCount({name: this.state.search, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: checked})
        this.fetchStaffList({page: 1, name: this.state.search, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: checked})
    }

    updateStaff = async (staff) =>{
        this.setState({selectedStaff: staff, showModal: true, purpose: 'update'})

        // let json = await Api.updateStaff({id: staff.id, confirmed: !staff.confirmed})
        // this.fetchStaffCount({name: this.state.search, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: this.state.confirmed})
        // this.fetchStaffList({page: this.state.page, name: this.state.search, event: this.state.selectedEvent, roleId: this.state.roleId, confirmed: this.state.confirmed})
    }

    render() {
        const { showModal, staffs, total, page} = this.state;
        
        return (
            <Space direction="vertical" style={{ padding: '20px 50px 20px 70px', width: '100%' }}>
                <Row>
                    <Col span={8}>
                        <Input.Search placeholder="Хайх" onSearch={this.searchBy} style={{width: '200px'}}/>
                        <Button
                            type="primary"
                            onClick={this.showModal}
                            style={{ marginLeft: '20px' }}>
                            Шинээр нэмэх
                        </Button>
                    </Col>
                    <Col>
                        <Switch checkedChildren="Идэвхитэй" unCheckedChildren="Идэвхигүй" defaultChecked={true} onChange={this.onToggle}/>
                        <Select
                            placeholder="Эрхээр шүүх"
                            style={{ width: '200px', marginRight: '30px', marginLeft: '30px' }}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            onChange={this.onRoleChange}
                            >
                            {[{id: 2, name: 'админ'}, {id: 8, name: 'оператор'}].map(item => {
                                return (
                                    <Select.Option key={item.id} id={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                        <Select
                            placeholder="Эвэнтээр шүүх"
                            style={{ width: '300px' }}
                            showSearch
                            allowClear
                            onSearch={this.onSearchEvent}
                            optionFilterProp="children"
                            onChange={this.eventOnChange}
                            onFocus={this.onFocus}
                            >
                            {this.state.events.map(item => {
                                return (
                                    <Select.Option key={item.id} id={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <List style={{width:'100%', backgroundColor: 'white', marginBottom: '30px'}} 
                            itemLayout="horizontal"
                            dataSource={staffs}
                            header={<div style={{width: '100%', padding: '6px 30px'}}>
                            <Row gutter={16} justify="start">
                                <Col span={2}><strong>Хэрэглэгч</strong></Col>
                                <Col span={2}><strong>Эрх</strong></Col>
                                <Col span={2} offset={2}><strong>Статус</strong></Col>
                                <Col span={14} offset={2}><strong>Эвэнт</strong></Col>
                            </Row>
                        </div>}
                            renderItem={(staff) => {
                                return (
                                    <List.Item actions= {[
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    this.updateStaff(staff);
                                                }}
                                                icon={<EditOutlined style={{color: '#1890ff'}}/>}
                                            />,
                                            // <Popconfirm
                                            //     title={staff.confirmed ? 'ИДЭВХИГҮЙ болгох уу?':'ИДЭВХИжүүлэх үү?'}
                                            //     onConfirm={() => {
                                            //         this.toggleConfirmation(staff);
                                            //     }}
                                            //     okText="Тийм"
                                            //     cancelText="Үгүй">
                                            //     {staff.confirmed ? <CloseCircleOutlined style={{color: '#1890ff'}}/> : <CheckCircleOutlined style={{color: '#1890ff'}}/>}
                                            // </Popconfirm>
                                        ]}>
                                        <div style={{width: '100%', padding: '6px 30px'}}>
                                            <Row gutter={16} justify="start">
                                                <Col span={2}>
                                                    {staff.username}
                                                </Col>
                                                <Col span={2}>
                                                    {staff.roleId == 2 ? 'админ' : staff.roleId == 8 ? 'оператор' : ''}
                                                </Col>
                                                
                                                <Col span={2} offset={2}>
                                                    {staff.confirmed ? 'Идэвхитэй' : 'Идэвхигүй'}
                                                </Col>
                                                <Col span={14} offset={2}>
                                                    {staff.eventId ? staff.eventName : ''}
                                                </Col>
                                            </Row>
                                        </div>
                                    </List.Item>
                                );}}/>
                        <Pagination
                            defaultPageSize={_limit}
                            current={page}
                            total={total}
                            showTotal={(total) => <span>Нийт: {total}</span>}
                            onChange={this.onPageChange}
                        />
                        
                    </Col>
                </Row>
                {showModal && this.createStaff()}
            </Space>
        );
    }
}

const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
    },
};
const customItemLayout = {
    wrapperCol: {
        xs: { span: 12, offset: 10 },
        sm: { span: 12, offset: 10 },
    },
};
const NewStaff = props => {
    const [form] = Form.useForm()
    const [events, updateEvents] = useState([])
    const [role, updateRole] = useState('operator')

    useEffect(()=> {
        onFocus()
        console.log('useEffect')
        form.setFieldsValue({
            username: props.staff.username ? props.staff.username:'',
            // password: '123123',
            role: props.staff.roleName || '',
            event: props.staff.eventId || '',
            status: props.staff.confirmed,
        })
    }, [props.staff])

    const onSearchEvent = async (val) => {
        let params = {_sort: 'id:desc', is_draft: 'false', _limit: 50} //hailtiin ehnii 50 utgiig
        if(val){
            params = {...params, name_contains: val}
        }
        let json = await Api.fetchEventList(params)
        if (json.code == 1000) {
            let events = json.list.map((e)=>{return {id: e.id, name: e.name}})
            updateEvents(events)
        } else {
            message.error( json.message || 'Алдаа гарав. fetchEvents');
        }
    }

    const onFocus = () => {
        onSearchEvent('')
    }

    const onFinish = async values => {
        console.log('onFinish', values)
        let params = {
            username: values.username,
            password: values.password,
            role: values.role,
            status: values.status ? 1 : 0,
        }
        if(values.event && values.role == 'operator'){
            params = {...params, event: values.event}
        }
        let json = ''
        if(props.staff){

        } else {
            json = await Api.createUser(params)
            if(json && !json.code && json.result){
                props.onSuccess()
            } else {
                message.error(json.message || 'Алдаа гарав. create user');
            }
        }
    }

    return (
        <Fragment >
            <div style={{padding: '0px 100px'}}>
                <Form form = {form} {...formItemLayout} style={{width: '80%'}} onFinish={onFinish} >
                        <Form.Item label="Хэрэглэгчийн нэр" name="username" rules={[{required: true, message: 'Хэрэглэгчийн нэр оруулна уу' }]}>
                            <Input autoComplete={"off"}/>
                        </Form.Item>
                        <Form.Item label="Нууц үг" name="password" rules={[{required: props.staff ? false : true, message: 'Нууц үг оруулна уу' }]}>
                            <Input.Password iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} autoComplete="new-password"/>
                        </Form.Item>
                        <Form.Item label="Үүрэг" name="role" valuePropName="value" initialValue={'operator'} >
                            <Select onChange={updateRole}>
                                <Select.Option value="Authenticated">Admin</Select.Option>
                                <Select.Option value="operator">Operator</Select.Option>
                            </Select>
                        </Form.Item>
                        {role == 'operator' && <Form.Item label="Эвэнт" name="event" valuePropName="value">
                            <Select showSearch
                                onSearch={onSearchEvent}
                                onFocus={onFocus}>
                                {events.map((ev)=> {return <Select.Option value={ev.id} key={ev.id}>{ev.name}</Select.Option>})}
                            </Select>
                        </Form.Item>}
                        <Form.Item label="Статус" name="status" valuePropName="checked" initialValue={true} >
                            <Switch checkedChildren="Идэвхитэй" unCheckedChildren="Идэвхигүй"  />
                        </Form.Item>
                        <Form.Item {...customItemLayout}>
                            <Button type="primary" htmlType="submit">Хадгалах</Button>
                        </Form.Item>
                </Form>
            </div>
        </Fragment>
    );
}
export default Staff;
