import { Badge, Button, Col, Icon, Image, Input , List, Modal, message, Pagination, Row, Switch} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import { Link } from 'react-router-dom';

import config from '../../config';
import history from '../../lib/history';
import Api from './api';

import EventCreate from './event_create';

const _limit = 3;

class EventList extends React.Component {
    constructor(props) {
        super(props);
        console.log('props', props)
        this.state = {
            page: props.page,
            total: 0,
            loading: true,
            events: [],
            showModal: false,
            search: props.search,
            toggle: false
        };
    }

    componentDidMount() {
        this.changeUrl();
        this.fetchEventListCount();
        this.fetchEventList({page: this.state.page});
    }

    createEvent = () => {
        this.setState({ showModal: true });
    };

    eventCreateModal = () => {
        return (
            <Modal
                title="Эвент үүсгэх"
                className="event-modal"
                width="70%"
                header={null}
                visible={true}
                footer={null}
                onCancel={() => {
                    this.setState({showModal: false });
                }}>
                <EventCreate onSuccess={this.onSuccess} />
            </Modal>
        );
    };

    onSuccess = () => {
        this.setState({
            showModal: false,
            search: ''
        });
        this.fetchEventListCount();
        this.fetchEventList({page: 1});
    };

    fetchEventListCount = async (filter = {}) => {
        let {search, toggle} = filter
        let params = {}
        if(search){
            params.name_contains = search
        }
        if(toggle){
            params.is_draft = 'false'
        }

        let json = await Api.fetchEventListCount(params);
        if ((json || json == 0) && !json.code) {
            this.setState({ total: json });
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    };

    fetchEventList = async ({page, search = '', toggle = false}) => {
        let _start = (page - 1) * _limit;
        
        let params = {_start, _limit, _sort: 'id:desc' }
        if(search){
            params = {...params, name_contains: search}
        }
        if(toggle){
            params = {...params, is_draft: 'false'}
        }

        let json = await Api.fetchEventList(params);
        console.log('list', json);
        if (json.code == 1000) {
            this.setState({ loading: false, events: json.list });
        } else {
            console.log(json);
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    };

    changeUrl = (filter = {}) => {
        let params = { page: this.state.page };
        params = { ...params, ...filter };

        Object.keys(params).forEach((key) => {
            if (!params[key]) {
                params[key] = undefined;
            }
        });
        let url = '/admin/events?' + querystring.stringify(params);
        history.push(url);
    };

    onPageChange = (page) => {
        if (this.state.page !== page) {
            this.setState({ page, loading: true });
            this.changeUrl({ page });
            let param = { page, search: this.state.search, toggle: this.state.toggle }
            this.fetchEventList(param);
        }
    };

    searchEvent = (val) => {
        this.setState({search: val, page: 1})
        this.changeUrl({search: val, page: 1})
        this.fetchEventListCount({search: val, toggle: this.state.toggle})
        this.fetchEventList({page: 1, search: val, toggle: this.state.toggle})
    };

    toggleDraft = (checked) => {
        this.setState({toggle: checked, page: 1})
        this.changeUrl({search: this.state.search, page: 1})
        this.fetchEventListCount({search: this.state.search, toggle: checked})
        this.fetchEventList({page: 1, search: this.state.search, toggle: checked})
    }

    render() {
        const { page, total } = this.state;
        var moment = require('moment');
        return (
            <div style={{ paddingLeft: '70px', paddingTop: '50px' }} className="event-list">
                <Row>
                    <Button type="primary" onClick={this.createEvent} style={{ marginLeft: '0px', marginBottom: '20px' }}>
                        Эвэнт үүсгэх
                    </Button>
                    <Input.Search placeholder='Эвэнт нэр...' onSearch={(val)=>this.searchEvent(val)} style={{width: '400px', marginLeft: '60px', marginBottom: '20px'}}
                    />
                    <div style={{marginLeft: '60px', marginTop: '5px'}} >
                        <Switch onChange={this.toggleDraft} /> Ноорог нуух
                    </div>
                </Row>
                <List
                    itemLayout="vertical"
                    dataSource={this.state.events}
                    style={{ height: '800px' }}
                    renderItem={(event) => {
                        let style = {};
                        let imgUrl = '';
                        if (event.banner && event.banner[0] && event.banner[0].url) {
                            style = {
                                backgroundImage: `url("${config.API_DOMAIN}${event.banner[0].url}")`,
                            };
                            imgUrl = `${config.API_DOMAIN}${event.banner[0].url}`;
                        }
                        // {/* <div className="event-banner" style={{ ...style }}></div> */}
                        return (
                            <div>
                                <div style={{ borderTop: '1px solid grey', width: '1000px', marginBottom: '2px' }} />
                                <Row style={{ marginBottom: '30px', height: '200px' }}>
                                    {event.is_draft ? (
                                        <Badge.Ribbon text="Ноорог" color={'red'} placement={'start'}>
                                            <Image
                                                style={{ verticalAlign: 'middle' }}
                                                width={200}
                                                src={imgUrl}
                                                fallback="data:image/png;base64,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"
                                            />
                                        </Badge.Ribbon>
                                    ) : (
                                        <Image
                                            style={{ verticalAlign: 'middle' }}
                                            width={200}
                                            src={imgUrl}
                                            fallback="data:image/png;base64,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"
                                        />
                                    )}
                                    <Col span={15} style={{ padding: '20px' }}>
                                        <div className="event-info">
                                            <div className="event-name">{event.name || 'Нэр байхгүй'}</div>
                                            <div className="event-general-info">{event.general_info || 'Тайлбар байхгүй'}</div>
                                            <div className="event-location">
                                                <span className="event-identifier">Хаана: </span>
                                                {event.location_desc}
                                            </div>
                                            <div className="event-date">
                                                <span className="event-identifier">Хэзээ: </span>
                                                {moment(event.open_time).format('YYYY-MM-DD') || '0000-00-00'}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={2} style={{ paddingLeft: '25px', paddingTop: '5px' }}>
                                        <div style={{ paddingBottom: '10px' }}>
                                            <Link to={`events/${event.id}`}>
                                                <button className="ant-btn event-button">Засах</button>
                                            </Link>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        );
                    }}
                />
                <Pagination defaultPageSize={_limit} defaultCurrent={1} current={page} total={total} showTotal={(total) => <span>Нийт: {total}</span>} onChange={this.onPageChange} />
                {this.state.showModal && this.eventCreateModal()}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let location = state.router.location || {};
    let query = querystring.parse(location.search.replace('?', ''));
    let page = Number.parseInt(query.page, 10) || 1;
    let search = query.name_contains || ''
    return {
        page,
        search
    };
};
export default connect(mapStateToProps)(EventList);
