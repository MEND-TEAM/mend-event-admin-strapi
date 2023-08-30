import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Image, Input,  Form, Button, Card, Col, Row, List, Switch, Avatar, Select, Space, message,Pagination,  Popconfirm, Modal, Table, Icon } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth'
import ModalParticipant from './ModalParticipant'
import CreateParticipant from './CreateParticipant'
import Api from './api';

const { Option } = Select;

const _limit = 10
class Participant extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: props.eventId || '',
            showModal: false,
            purpose: '',
            page: 1,
            total: 0,
            selectedParticipantId: null,


            eventparticipants: [],
            participantTypeList: [],
            filtered: [],
            updateParticipantModal: false,
            idParticipant: null,
            createParticipantModal: false,
            selectedRowKeys: [],
            disabled: true
        }
    }

    async componentDidMount() {
        // this.fetchParticipantTypes();
        this.fetchParticipants({page: 1});
        this.getCountParticipants();
    }

    
    getCountParticipants = async () => {
        let json = await Api.countParticipants({event: this.state.eventId})
        console.log('count', json)
        if((json || json == 0) && !json.code){
            this.setState({total: json})
        } else {
            message.error(json.message || 'Алдаа гарлаа. count participants'); 
        }
        
    }

    fetchParticipants = async ({ page = 1, filter = '' }) => {
        let json = await Api.fetchParticipants({event: this.state.eventId, max: _limit, page})
        console.log('participants', json)
        if(json && !json.code){
            this.setState({eventparticipants: json})
        } else {
            message.error(json.message || 'Алдаа гарлаа. fetch participants'); 
        }
    }
    
    createParticipant = () => {
        this.setState({ showModal: true, purpose: 'create' })
    }
    
    updateParticipant = (record) => {
        this.setState({ showModal: true, purpose: 'update', selectedParticipantId: record.id })
    }

    removeParticipant = async (record) => {
        console.log('delete', record)
        let json = await Api.removeParticipant({id: record.id})
        if(json && !json.code){
            this.setState({page: 1})
            this.fetchParticipants({ page: 1});
        } else {
            message.error(json.message || 'Алдаа гарлаа. remove participant'); 
        }
    }

    onPageChange = (page) => {
        if (this.state.page !== page) {
            this.setState({ page, loading: true });
            this.fetchParticipants({ page });
        }
    };
    
    participantModal = () => {
        const {selectedParticipantId, purpose, eventId} = this.state
        console.log('selected parti', selectedParticipantId)
        return (
            <Modal
                title={"Оролцогч байгууллага " + (purpose == 'create' ? "үүсгэх" : "засах")}
                className="participant-modal"
                header={null}
                visible={true}
                footer={null}
                width="60%"
                onCancel={() => {
                    this.setState({ showModal: false });
                    // this.fetchParticipants();
                }}>
                    
                <ModalParticipant participantId={selectedParticipantId} purpose={purpose} eventId={eventId} onSuccess={this.onSuccess}/>
            </Modal>
        )
    }
    
    onSuccess = () => {
        this.setState({page: 1, showModal: false})
        this.getCountParticipants();
        this.fetchParticipants({page: 1});
    }


    
    
    render() {
        const { eventparticipants, eventId, selectedRowKeys, disabled, page = 1, showModal, total } = this.state;
        let i = 1 + (page - 1) * _limit;
        const columns = [
            {
                title: 'Д/д',
                key: 'id',
                render: () => (
                <div> {i++}</div>
                )
            },
            {
                title: 'Лого',
                dataIndex: 'banner',
                render: (text) => <Image
                    style={{ verticalAlign: 'middle' }}
                    width={60}
                    src={`${config.API_DOMAIN}/${text}`}
                    fallback="data:image/png;base64,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"
                />
            },
            {
                title: 'Байгууллагын нэр',
                dataIndex: 'name',
                width: '200px',
            },
            {
                title: 'Дэлгэрэнгүй',
                dataIndex: 'description',
                width: '900px',
                render: (text) => <div> {text.substring(0, 200)}</div>
            },
            {
                title: 'Оролцох хэлбэр',
                dataIndex: 'meta',
            },
            {
                title: ' ',
                key: 'action',
                render: (text, record) => (
                  <Space size="middle">
                    <EditOutlined onClick={()=>this.updateParticipant(record)} style={{color: '#1890ff'}}/>
                    <Popconfirm
                        title="Устгах уу?"
                        onConfirm={() => { this.removeParticipant(record) }}
                        okText="Тийм"
                        cancelText="Үгүй"
                    >
                        <DeleteOutlined style={{color: '#1890ff'}}/>
                    </Popconfirm>
                  </Space>
                ),
              },

        ]
        return (
            <div style={{ marginRight: '60px' }}>
                <Row gutter={16}>
                    <Card title="Оролцогч байгууллагууд" bordered={false} style={{width: '100%'}}>
                        <Button icon={<PlusOutlined/>} type="primary" onClick={this.createParticipant} style={{ marginBottom: '10px' }}>Шинээр нэмэх</Button>
                        <Table
                            rowKey="id"
                            pagenation={false}
                            columns={columns}
                            dataSource={eventparticipants}
                            size="small" />
                        <Pagination
                            defaultPageSize={_limit}
                            current={page}
                            total={total}
                            showTotal={(total) => <span>Нийт: {total}</span>}
                            onChange={this.onPageChange}
                        />
                    </Card>
                </Row>
                {showModal && this.participantModal()}
                {/* {this.createParticipantModal()} */}
            </div>
        )
    }
}
export default Participant;