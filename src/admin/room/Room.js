import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Form, Button, Card, Col, Row, List, Avatar, message, Icon, Upload, Modal, Popconfirm, Table } from 'antd';
import { ExclamationCircleOutlined, FileSearchOutlined, SearchOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth'
import CreateRoom from './CreateRoom'
import UpdateRoom from './UpdateRoom'
import moment from 'moment';

import Api from './api';

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: props.eventId || '',
            selectedRoomId: 0,
            loading: true,
            eventrooms: [],
            showModal: false,
            purpose: '',

        }
    }

    componentDidMount() {
        this.fetchRoom();
    }

    fetchRoom = async () => {
        let json = await Api.fetchRooms({event: this.state.eventId})
        if(json && !json.code) {
            this.setState({
                eventrooms: json,
                loading: false
            })
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    }

    deleteRoom = async () => {
        let json = await Api.deleteRoom({roomId: this.state.selectedRoomId})
        console.log('json', json)
        if(json && !json.code) {
            this.fetchRoom()
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    }

    selectRoom = (selectedRowKeys, selectedRows) => {
        this.setState({selectedRoomId: selectedRows[0].id})
    }
    
    createRoom = () => {
        this.setState({ showModal: true, purpose: 'create' })
    }

    updateRoom = () => {
        this.setState({ showModal: true, purpose: 'update' })
    }

    createRoomModal = () => {
        return (
            <Modal
                title={this.state.purpose == 'create' ? "Өрөө үүсгэх" : "Өрөө засах"}
                className="create-speaker-modal"
                header={null}
                visible={true}
                footer={null}
                width="70%"
                onCancel={() => {
                    this.setState({ showModal: false })
                }}
            >
                <CreateRoom eventId={this.state.eventId} purpose={this.state.purpose} roomId={this.state.selectedRoomId} onSuccess={this.onRoomSuccess}/>
            </Modal>
        )
    }

    onRoomSuccess = () => {
        this.fetchRoom()
        this.setState({showModal: false})
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Өрөөний нэр..`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={()=>confirm()}
                    style={{ width: 384, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => confirm()}
                    icon={<SearchOutlined />}
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            filtered ? <SearchOutlined style={{color: 'red'}}/> : <SearchOutlined style={{color: '#1890ff'}}/>
        ),
        
        onFilter: (value, record) => {
            if (!record[dataIndex]) return false;
            return record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        }
    });

    render() {
        const { loading, eventrooms, selectedRoomId, showModal, eventId, roomRelatedProgram, filtered, selectedRowKeys, disabled } = this.state;
        const columnsRoom = [
            {
                title: 'Нэр',
                dataIndex: 'room_number',
                ...this.getColumnSearchProps('room_number'),
                width: '400px'
            },
            {
                title: 'Зураг',
                dataIndex: 'room_location_img',
                render: (text) => <Avatar style={{   }} src={`${config.API_DOMAIN}${text}`} />
            },
            {
                title: 'Байршил',
                dataIndex: 'room_location',
            },
        ]
        
        return (
            <div style={{ marginRight: '60px' }}>
                <Row gutter={16} style={{ marginTop: "10px" }}>
                    <Col span={16}>
                        <Card title="Өрөөний жагсаалт" bordered={false}>
                            <Button type="primary" onClick={this.createRoom} style={{ marginBottom: '10px' }}>Нэмэх</Button>
                            <Button type="primary" onClick={this.updateRoom}
                                disabled={selectedRoomId == 0} style={{ marginLeft: "10px", marginBottom: '10px' }}>Засах</Button>
                            {selectedRoomId != 0 && <Popconfirm
                                title="Өрөөг устгах уу?"
                                type="danger"
                                onConfirm={this.deleteRoom}
                                okText="Тийм"
                                cancelText="Үгүй"
                                icon={<ExclamationCircleOutlined />}
                            >
                                <Button type="danger" style={{ marginLeft: '10px', marginBottom: '10px' }} disabled={selectedRoomId == 0}>Устгах</Button>
                            </Popconfirm>}
                            
                            <Table
                                rowSelection={{
                                    type: 'radio',
                                    onChange: this.selectRoom,
                                }}
                                loading={loading}
                                columns={columnsRoom}
                                dataSource={eventrooms}
                                rowKey="id"
                                pagination={false}
                                size="small" />
                        </Card>
                    </Col>
                </Row>
                {showModal && this.createRoomModal()}
            </div>
        )
    }
}
export default Room;