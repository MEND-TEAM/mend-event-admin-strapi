import { Button, Icon, Input, message, Modal, Pagination, Popconfirm, Select, Table, Tabs } from 'antd';
import axios from 'axios';
import moment from 'moment';
import querystring from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import config from '../../config';
import Auth from '../../lib/auth';
import fetchWithTimeout from '../../lib/fetchWithTimeout';
import history from '../../lib/history';
import Api from './api';
import CreateUser from './CreateUser';

const { Option } = Select;
const _limit = 10;

const columns = [
    {
        title: 'Д/д:',
        dataIndex: 'id'
    },
    {
        title: 'Нэр',
        dataIndex: 'firstname'
    },
    {
        title: 'Овог',
        dataIndex: 'lastname'
    },
    {
        title: 'Утас',
        dataIndex: 'phone'
    },
    {
        title: 'Регистер',
        dataIndex: 'register_number'
    },
    // {
    //     title: 'Мэргэжил',
    //     dataIndex: 'profession_type',
    // },
    // {
    //     title: 'Мэргэшил',
    //     dataIndex: 'professions',
    // },
    // {
    //     title: 'Сургууль',
    //     dataIndex: 'universities',
    // },
    // {
    //     title: 'Эмнэлэг',
    //     dataIndex: 'hospital',
    // },
    {
        title: 'Элссэн огноо',
        dataIndex: 'created_at'
    }
];

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userCreateModal: false,
            userDetailModal: false,
            total: 0,
            page: props.page || 1,
            phone: props.phone || '',
            userList: [],
            eventList: [],

            disabled: true,
            
            selectedUserId: null,
            selectedRowKeys: [],
            fetch: false,
            eventId: props.eventId || ''
        };
    }

    componentDidMount() {
        this.getUserCount({});
        this.getUserList({});
        this.getEventList();
    }

    getEventList = async () => {
        let eventList = [];

        let url = `${config.API_DOMAIN}/events/list?is_draft=false`;
        let json = await fetchWithTimeout(url, {
            header: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
        eventList = json.map(ev => {
            return {
                id: ev.id,
                name: ev.name
            };
        });
        this.setState({ eventList });
    };

    getUserCount = async filter => {        
        let params = { phone_contains: this.state.phone };
        params = { ...params, ...filter };

        if (this.state.eventId) {
            let json = await fetchWithTimeout(
                `${config.API_DOMAIN}/doctors/countbyevent`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + Auth.getToken()
                    },
                    body: JSON.stringify({
                        event_id: this.state.eventId,
                        phone_contains: this.state.phone
                    })
                }
            );
            if ((json || json == 0) && !json.code) {
                this.setState({
                    total: (json[0] || {}).cnt || 0
                });
            } else {
                message.error(json.message || 'Алдаа гарав. getUserCount');
            }
        } else {
            let json = await Api.fetchUserCount(params);

            if ((json || json == 0) && !json.code) {
                this.setState({
                    total: json || 0
                });
            } else {
                message.error(json.message || 'Алдаа гарав. getUserCount');
            }
            
        }
    };
    
    getUserList = async () => {        
        let _start = (this.state.page - 1) * _limit;
        let params = {
            phone_contains: this.state.phone,
            _limit,
            _start,
            _sort: 'created_at:desc'
        };
        
        if (this.state.eventId) {
            let json = await fetchWithTimeout(
                `${config.API_DOMAIN}/doctors/listbyevent`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + Auth.getToken()
                    },
                    body: JSON.stringify({
                        event_id: this.state.eventId,
                        max: _limit,
                        page: this.state.page,
                        phone_contains: this.state.phone
                    })
                }
            );
        
            if (json && !json.code) {
                let list = json;
                list = list.map(user => {
                    let created_at = moment(user.created_at).format('YYYY.MM.DD HH:mm');
                    return {
                        ...user,
                        created_at
                    };
                });
                this.setState({
                    userList: list
                });
            } else {
                message.error(json.message || 'Алдаа гарав. getUserList');
            }
        } else {
            let json = await Api.fetchUserList(params);

            if (json.code == 1000) {
                let list = json.list || [];
                list = list.map(user => {
                    let created_at = moment(user.created_at).format('YYYY.MM.DD HH:mm');
                    return {
                        ...user,
                        created_at
                    };
                });
                this.setState({
                    userList: list
                });
            } else {
                message.error(json.message || 'Алдаа гарав. getUserList');
            }

        }
    };

    selectUser = selectedRowKeys => {
        let user = this.state.userList.find(
            one => one.id == selectedRowKeys[0]
        );

        this.setState({
            selectedUserId: user ? user.id : 0,
            disabled: false,
            selectedRowKeys
        });
    };

    onChanged = ({ type, item }) => {
        if (type == 'created') {
            
            this.setState(
                {
                    userId: 0,
                    userCreateModal: false,
                    phone: '',
                    page: 1,
                    eventId: ''
                },
                () => {
                    this.getUserCount({});
                    this.getUserList({});
                    this.changeUrl({});
                }
            );
        } else if (type == 'updated') {
            this.setState({ userCreateModal: false }, () => {
                this.getUserList({});
            });
        }
    };

    createUser = () => {
        this.setState({ userCreateModal: true, selectedUserId: 0 });
    };

    updateUser = () => {
        this.setState({ userCreateModal: true });
    };

    userCreateModal = () => {
        if (this.state.userCreateModal) {
            return (
                <Modal
                    title={
                        this.state.selectedUserId > 0
                            ? 'Гишүүн засах'
                            : 'Гишүүн нэмэх'
                    }
                    className="program-modal"
                    width="70%"
                    header={null}
                    visible={true}
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            userCreateModal: false
                        });
                    }}>
                    <CreateUser
                        userId={this.state.selectedUserId}
                        onChanged={this.onChanged}
                    />
                </Modal>
            );
        }
    };

    changeUrl = (filter = {}) => {
        let params = {
            page: this.state.page,
            eventId: this.state.eventId,
            phone: this.state.phone
        };
        params = { ...params, ...filter };

        Object.keys(params).forEach(key => {
            if (!params[key]) {
                params[key] = undefined;
            }
        });        
        let url = `/${(this.props.from || 'admin')}/members?${querystring.stringify(params)}`
        history.push(url);
    };

    deleteUser = async () => {
        const self = this;
        await axios
            .post(
                `${config.API_DOMAIN}/doctors/customDelete`,
                {
                    userId: this.state.selectedUserId
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(function(response) {
                if (response.status == 200) {
                    self.getUserList({});
                    message.success('Хэрэглэгчийг устгалаа');
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    eventOnChange = async value => {
        this.setState({ eventId: value, page: 1 }, () => {
            this.getUserCount({});
            this.getUserList({});
            this.changeUrl({});
        });
    };

    phoneOnChange = event => {
        this.setState({ phone: event.target.value, page: 1 }, () => {
            this.getUserCount({});
            this.getUserList({});
            this.changeUrl({});
        });
    };

    onPageChange = page => {
        if (this.state.page !== page) {
            this.setState({ page }, () => {
                this.getUserList({});
                this.changeUrl({});
            });
        }
    };

    render() {
        const { disabled, selectedRowKeys, userList, page, total } = this.state;

        return (
            <div style={{ paddingLeft: '70px', paddingRight: '50px' }}>
                {this.props.from}
                <div style={{ padding: '20px 0px 20px 0px' }}>
                    <Input
                        placeholder="Утас"
                        style={{ width: '100px', textAlign: 'center' }}
                        onChange={this.phoneOnChange}
                        value={`${this.state.phone}`}
                    />
                    <Select
                        placeholder="Эвент"
                        name="event"
                        style={{ width: '300px', marginLeft: '20px' }}
                        showSearch
                        optionFilterProp="children"
                        onChange={this.eventOnChange}
                        value={this.state.eventId}>
                        <Option key={''} id={'all'} value={''}>
                            Бүх гишүүд
                        </Option>
                        {this.state.eventList.map(item => {
                            return (
                                <Option
                                    key={item.id}
                                    id={item.id}
                                    value={item.id.toString()}>
                                    [{item.id}] {item.name}
                                </Option>
                            );
                        })}
                    </Select>
                    <Button
                        type="primary"
                        onClick={this.createUser}
                        style={{ marginLeft: '20px' }}>
                        Гишүүн нэмэх
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.updateUser}
                        style={{ marginLeft: '20px' }}
                        disabled={disabled}>
                        Засах
                    </Button>
                    {this.props.from == 'admin' && <Popconfirm
                        title="Сонгосон гишүүнийг хасах уу?"
                        type="danger"
                        onConfirm={this.deleteUser}
                        okText="Тийм"
                        cancelText="Үгүй"
                        icon={
                            <Icon
                                type="exclamation-circle"
                                style={{ color: 'red' }}
                            />
                        }>
                        <Button
                            type="danger"
                            style={{ marginLeft: '20px' }}
                            disabled={disabled}>
                            Хасах
                        </Button>
                    </Popconfirm>}
                </div>
                <div style={{ backgroundColor: 'white' }}>
                    <Table
                        rowSelection={{
                            type: 'radio',
                            onChange: this.selectUser,
                            selectedRowKeys: selectedRowKeys
                        }}
                        columns={columns}
                        dataSource={userList}
                        pagination={false}
                        rowKey="id"
                        size="small"
                    />
                    <Pagination
                        style={{ margin: '20px 60px' }}
                        defaultPageSize={_limit}
                        current={page}
                        total={total}
                        showTotal={total => <span>Нийт: {total}</span>}
                        onChange={this.onPageChange}
                    />
                </div>
                {this.userCreateModal()}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let location = state.router.location || {};
    let query = querystring.parse(location.search.replace('?', ''));
    let page = Number.parseInt(query.page, 10) || 1;
    let phone = query.phone || '';
    let eventId = query.eventId || '';

    return {
        page,
        phone,
        eventId
    };
};
export default connect(mapStateToProps)(User);
