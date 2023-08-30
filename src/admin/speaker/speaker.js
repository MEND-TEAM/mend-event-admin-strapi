import React from 'react';
import { Avatar, Button, Card, Col, Form, Icon, Input, List, message, Modal, Popconfirm, Pagination, Row, Switch, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import config from '../../config';

import AddProgramSpeaker from './AddProgramSpeaker';
import CreateSpeaker from './createSpeaker';

import Api from './api';

const _limit = 10;
const apiDomain = config.API_DOMAIN;

class Speaker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: props.eventId || '',
            pageSize: props.pageSize || _limit,
            speakerTotal: 0,
            speakerPage: 1,
            speakers: [],
            loading: true,
            selectedSpeakerId: 0,
            filter: '',

            speakerModal: false,
            speakerModalAddProgram: false,
            speakerRelatedProgram: [],
        };
    }

    componentDidMount() {
        this.fetchSpeakerCount({ });
        this.fetchSpeakerList({ page: 1 });
    }

    fetchSpeakerCount = async ({filter = ''}) => {
        let json = await Api.fetchSpeakerCount({ event: this.state.eventId, name_contains: filter });
        if (!(json || {}).code) {
            //TODO: add code param to api response
            this.setState({ speakerTotal: json });
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

    fetchSpeakerList = async ({ page = 1, filter = this.state.filter }) => {
        this.setState({loading: true})
        let _offset = (page - 1) * _limit;
        let json = await Api.fetchSpeakerListByEvent({ event: this.state.eventId, _limit, _offset, filter });
        if (json && !json.code) {
            this.setState({ speakers: json, loading: false });
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

    fetchPrograms = async (speakerId) => {
        let json = await Api.fetchProgramsBySpeaker({event_speaker: speakerId})
        if (json && !json.code) {
            //this.setState({ speakers: json, loading: false });
            let programs = []
            json.forEach((item)=>{
                let program = item.event_program || {}
                programs.push({id: item.id, title: program.title || '', time: moment.utc(program.open_time) || '', role: item.role || ''})
            })
            programs.sort((a,b) => {return a.time > b.time ? 1 : -1})
            this.setState({speakerRelatedProgram: programs})
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

    getFilterSearch = (ev) => {
        this.fetchSpeakerCount({filter: ev.target.value});
        this.fetchSpeakerList({page: 1, filter: ev.target.value})
        this.setState({page: 1, filter: ev.target.value})
    };

    selectSpeaker = (speakerId) => {
        this.setState({ selectedSpeakerId: speakerId });
        this.fetchPrograms(speakerId);
    };

    onPageChange = (page) => {
        if (this.state.speakerPage !== page) {
            this.setState({ speakerPage: page, loading: true });
            this.fetchSpeakerList({ page });
        }
    };

    createSpeaker = () => {
        this.setState({ speakerModal: true, selectedSpeakerId: 0 });
    };

    updateSpeaker = (speakerId) => {
        this.setState({ speakerModal: true, selectedSpeakerId: speakerId });
    };

    speakerModal = (speakerId) => {
        return (
            <Modal
                title="Оролцогчийн мэдээлэл"
                className="create-speaker-modal"
                header={null}
                visible={true}
                width="70%"
                footer={null}
                onCancel={() => {
                    this.setState({speakerModal: false, speakerRelatedProgram: [] });
                }}>
                <CreateSpeaker eventId={this.state.eventId} speakerId={this.state.selectedSpeakerId || 0} onSuccess={this.onSpeakerSuccess}/>
            </Modal>
        );
    };

    onSpeakerSuccess = () => {
        this.setState({speakerModal: false})
        this.fetchSpeakerCount({ });
        this.fetchSpeakerList({ page: 1 });
    }

    addProgramSpeaker = () => {
        this.setState({speakerModalAddProgram: true });
    };

    speakerModalAddProgram = () => {
        return (
            <Modal
                title="Хөтөлбөр сонгох"
                className="program-speaker-modal"
                width="50%"
                header={null}
                visible={true}
                footer={null}
                onCancel={() => {
                    // this.fetchPrograms(this.state.selectedSpeakerId);
                    this.setState({ speakerModalAddProgram: false });
                }}>
                <AddProgramSpeaker speakerId={this.state.selectedSpeakerId} eventId={this.state.eventId} onSuccess={this.onInserted}/>
            </Modal>
        );
    };

    onInserted = () => {
        this.setState({speakerModalAddProgram: false})
        this.fetchPrograms(this.state.selectedSpeakerId);
    }
    
    removeBinding = async (data) => {
        let json = await Api.removeSpeakerFromProgram({id: data.id})
        if(json && !json.code){
            this.fetchPrograms(this.state.selectedSpeakerId);
        } else {
            message.error(json.message || 'Алдаа гарлаа remove binding'); 
        }
    };

    removeSpeaker = async (speaker) => {
        let json = await Api.removeSpeaker({id: speaker.id})
        if(json && json.result){
            this.setState({speakerRelatedProgram: []})
            this.fetchSpeakerList({ page: 1 });
            
        } else {
            message.error(json.message || 'Алдаа гарлаа remove speaker'); 
        }
    }

    render() {
        const { pageSize, speakerPage = 1, speakerTotal = 0, speakers = [], loading, selectedSpeakerId = 0, speakerModal: speakerModal = false, 
            speakerRelatedProgram = [] , speakerModalAddProgram} = this.state;
        
        return (
            <div style={{ marginRight: '60px' }}>
                <Row gutter={16} style={{ marginTop: '10px' }}>
                    <Col span={12}>
                        <Card title="Оролцогчид" bordered={false}>
                            <Button type="primary" onClick={this.createSpeaker} style={{ marginBottom: '10px' }}>
                                Шинээр нэмэх
                            </Button>
                            <Input type="text" onChange={this.getFilterSearch} />
                            <List
                                itemLayout="horizontal"
                                dataSource={speakers}
                                loading={loading}
                                renderItem={(speaker) => {
                                    
                                    return (
                                        <List.Item style={{backgroundColor: selectedSpeakerId == speaker.id ? '#1890ff' : ''}}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={`${apiDomain}${speaker.picture}`} icon={<UserOutlined />} />}
                                                title={speaker.name}
                                                description={speaker.position}
                                                onClick={() => {
                                                    this.selectSpeaker(speaker.id);
                                                }}
                                                
                                            />
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    this.updateSpeaker(speaker.id);
                                                }}
                                                icon={<EditOutlined style={{color: selectedSpeakerId == speaker.id ? 'white' : '#1890ff'}}/>}
                                            />
                                            <Popconfirm
                                                title="Оролцогчийг устгах уу?"
                                                onConfirm={() => {
                                                    this.removeSpeaker(speaker);
                                                }}
                                                okText="Тийм"
                                                cancelText="Үгүй">
                                                <DeleteOutlined style={{color: selectedSpeakerId == speaker.id ? 'white' : '#1890ff'}}/>
                                            </Popconfirm>
                                        </List.Item>
                                    );
                                }}
                            />
                            <Pagination
                                defaultPageSize={pageSize}
                                defaultCurrent={1}
                                current={speakerPage}
                                total={speakerTotal}
                                showTotal={(speakerTotal) => <span>Нийт: {speakerTotal}</span>}
                                onChange={this.onPageChange}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Оролцох хөтөлбөрүүд" bordered={false}>
                            <div className="table-operations">
                                <Button type="primary" onClick={this.addProgramSpeaker} icon={<PlusOutlined />} disabled={selectedSpeakerId == 0}>
                                    Хөтөлбөр сонгох
                                </Button>
                            </div>
                            <List
                                itemLayout="horizontal"
                                dataSource={speakerRelatedProgram}
                                renderItem={(data) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={data.role}
                                            description={data.time.format('HH:mm MM/DD ') + ' : ' + data.title}
                                        />
                                        {/* <EditOutlined onClick={()=>this.updateProgramSpeaker(data.event_program, data.id)}/> */}
                                        <Popconfirm
                                            title="Устгах уу?"
                                            onConfirm={() => {
                                                this.removeBinding(data);
                                            }}
                                            okText="Тийм"
                                            cancelText="Үгүй">
                                            <DeleteOutlined style={{color: '#1890ff'}}/>
                                        </Popconfirm>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                {speakerModal && this.speakerModal()}
                {speakerModalAddProgram && this.speakerModalAddProgram()}

                {/* {this.updateSpeaProgModal()}
                {this.updateSpeakerModal()} */}
                
            </div>
        );
    }
}
export default Speaker;
