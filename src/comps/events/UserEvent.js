import { Button, Col, message, Row, Table } from 'antd';
import axios from 'axios';
import React from 'react';
import config from '../../config';
import Auth from '../../lib/auth';

class UserEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys1: [],
            selectedRowKeys2: [],
            eventList: [],
            conEventList: [],
            addButton: true,
            deleteButton: true,
            eventToConnect: null,
            eventToDisconnect: null,
            userId: this.props.userId
        };
    }

    async componentDidMount() {
        this.props.objectList['UserEvent'] = this;
        this.updateEventList();
    }

    componentWillUnmount() {
        delete this.props.objectList['UserEvent'];
    }

    update = () => {
        this.updateEventList();
    };

    updateEventList = async () => {
        const self = this;
        const response = await fetch(
            `${config.API_DOMAIN}/events/eventListOfUser?user=${this.state.userId}`,
            {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            }
        );
        if (response.ok) {
            const list = await response.json();
            const eventList = [];
            const conEventList = [];
            let counter1 = 0;
            let counter2 = 0;
            list.map(event => {
                if (event.userId) {
                    conEventList.push({
                        id: event.id,
                        name: event.name,
                        index: counter1,
                        userId: event.userId
                    });
                    counter1++;
                } else {
                    eventList.push({
                        id: event.id,
                        name: event.name,
                        index: counter2
                    });
                    counter2++;
                }
            });
            self.setState({
                ...self.state,
                eventList,
                conEventList,
                addButton: true,
                deleteButton: true,
                eventToConnect: null,
                eventToDisconnect: null,
                selectedRowKeys1: [],
                selectedRowKeys2: []
            });
        }
    };

    selectEventToConnect = (selectedRowKeys, selectedRows) => {
        this.setState({
            ...this.state,
            eventToConnect: selectedRows[0].index,
            selectedRowKeys1: selectedRowKeys,
            addButton: false
        });
    };

    selectEventToDisconnect = (selectedRowKeys, selectedRows) => {
        this.setState({
            ...this.state,
            eventToDisconnect: selectedRows[0].index,
            selectedRowKeys2: selectedRowKeys,
            deleteButton: false
        });
    };

    connect = async () => {
        const { eventList, eventToConnect, userId } = this.state;
        const data = {
            event: eventList[eventToConnect].id,
            related_id: userId
        };
        await axios
            .post(`${config.API_DOMAIN}/eventusers/customCreate`, data, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            })
            .then(function(response) {
                if (response.status == 200) {
                    message.success('Хэрэглэгч эвенттэй холбогдлоо');
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        // this.updateEventList();
        this.props.update();
    };

    disconnect = async () => {
        const { conEventList, eventToDisconnect } = this.state;
        const id = conEventList[eventToDisconnect].userId;
        await axios
            .delete(
                `${config.API_DOMAIN}/eventusers/${id}`,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(function(response) {
                if (response.status == 200) {
                    message.success('Хэрэглэгч эвентээс салгагдлаа');
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        this.props.update();
    };

    onChange = (selectedRowKeys, selectedRows) => {
        // console.log('selected rows keys: ', selectedRowKeys);
        // console.log('selected rows: ', selectedRows);
    };

    render() {
        const {
            addButton,
            deleteButton,
            eventList,
            conEventList,
            selectedRowKeys1,
            selectedRowKeys2
        } = this.state;
        const columns1 = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: 'Холбогдоогүй эвент',
                dataIndex: 'name'
            }
        ];

        const columns2 = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: 'Холбогдсон эвент',
                dataIndex: 'name'
            }
        ];

        if (!this.state.userId) {
            return <div>Something is wrong!</div>;
        }

        return (
            <div style={{ paddingLeft: '30px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <div style={{ paddingBottom: '20px' }}>
                            <Button
                                type="primary"
                                disabled={addButton}
                                size="small"
                                onClick={this.connect}>
                                Connect
                            </Button>
                        </div>
                        <Table
                            size="small"
                            columns={columns1}
                            dataSource={eventList}
                            rowSelection={{
                                type: 'radio',
                                onChange: this.selectEventToConnect,
                                selectedRowKeys: selectedRowKeys1
                            }}></Table>
                    </Col>
                    <Col span={12}>
                        <div style={{ paddingBottom: '20px' }}>
                            <Button
                                type="primary"
                                disabled={deleteButton}
                                size="small"
                                onClick={this.disconnect}>
                                Disconnect
                            </Button>
                        </div>
                        <Table
                            size="small"
                            columns={columns2}
                            dataSource={conEventList}
                            rowSelection={{
                                type: 'radio',
                                onChange: this.selectEventToDisconnect,
                                selectedRowKeys: selectedRowKeys2
                            }}></Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserEvent;
