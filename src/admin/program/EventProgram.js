import React from 'react';
import { Button, Card, Col, Form, Icon, Input, message, Modal, Pagination, Popconfirm, Row, Select, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined  } from '@ant-design/icons';

import config from '../../config';
import moment from 'moment';
import Auth from '../../lib/auth';
import ProgramDetail from './ProgramDetail';

import Api from './api';

const { Option } = Select;
const _limit = 10;

class EventProgram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId || '',
            total: 0,
            page: 1,
            pageSize: props.pageSize || _limit,
            showModal: false,
            selectedProgram: 0,
            programList: [],
            roomList: [],
        };
    }

    async componentDidMount() {
        this.fetchRoomsEvent();
        this.fetchProgramsCount();
        
    }

    fetchRoomsEvent = async () => {
        let json = await Api.fetchRoomsEvent({ event: this.state.eventId });
        console.log('rooms', json)
        if (json && !json.code) {
            this.setState({ roomList: json });
            this.fetchPrograms({ page: 1 });
        } else {
            message.warning(
                <div>
                    Өрөөний мэдээлэл олдсонгүй.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    };

    fetchProgramsCount = async (filter = '') => {
        let json = await Api.fetchProgramsCount({ event: this.state.eventId, filter });

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

    fetchPrograms = async ({ page = 1, filter = '' }) => {
        let _start = (page - 1) * _limit;
        let json = await Api.fetchProgramsByEvent({ event: this.state.eventId, _limit, _start, _sort: 'open_time:asc', filter });
        console.log('json', json);
        if (json && !json.code) {
            json.map((p) => {
                let roomName = this.state.roomList.find(el => {return el.id == p.eventroom});
                p.roomName = (roomName || {}).room_number || '';

                let duration = Math.floor(moment.duration(moment(p.close_time).diff(moment(p.open_time))).asMinutes());
                if (duration < 0) {
                    duration = 0;
                    message.error(
                        <div>
                            {p.title || p.topic || ''}
                            <br />
                            "ДУУСАХ" цаг "ЭХЛЭХ" цагаас өмнө байна.
                        </div>
                    );
                }
                p.open_time = moment.utc(p.open_time).format('HH:mm MM/DD');
                let hour = Math.floor(duration / 60);
                let min = duration % 60;
                p.duration = (hour ? hour + 'ц ' : '') + (min ? min + 'мин' : '');
                
                if(p.program_type == "undefined") {
                    p.program_type = ''
                }
            });

            this.setState({ programList: json });
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

    onPageChange = (page) => {
        if (this.state.page !== page) {
            this.setState({ page, loading: true });
            this.fetchPrograms({ page });
        }
    };

    onSearch = (val) => {
        this.fetchProgramsCount(val);
        this.fetchPrograms({ page: 1, filter: val });
    };

    onProgramSuccess = () => {
        this.setState({ showModal: false, page: 1 });
        this.fetchProgramsCount();
        this.fetchPrograms({ page: 1 });
    };

    programModal = () => {
        return (
            <Modal
                title="Хөтөлбөр"
                className="program-modal"
                width="70%"
                header={null}
                visible={true}
                footer={null}
                onCancel={() => {
                    this.setState({ showModal: false });
                }}>
                <ProgramDetail programId={this.state.selectedProgram} eventId={this.state.eventId} onSuccess={this.onProgramSuccess} roomList = {this.state.roomList}/>
            </Modal>
        );
    };

    selectProgram = (programId) => {
        this.setState({ selectedProgram: programId, showModal: true });
    };

    createProgram = () => {
        this.setState({ selectedProgram: 0, showModal: true });
    };
    deleteProgram = async (id) => {
        let json = await Api.deleteProgram({id})
        console.log('delete',json)
        this.setState({ page: 1, filter: '' });
        this.fetchProgramsCount();
        this.fetchPrograms({ page: 1 });
    }
    render() {
        const { pageSize, page, total, showModal } = this.state;
        const pagination = false;
        let i = 1 + (page - 1) * _limit;
        const columns = [
            {
                title: 'Д/д',
                // dataIndex: 'id',
                key: 'id',
                render: () => (
                <div> {i++}</div>
                )
            },
            {
                title: 'Нэр',
                dataIndex: 'title',
                key: 'name',
            },
            {
                title: 'Төрөл',
                dataIndex: 'program_type',
                key: 'type',
            },
            {
                title: 'Өрөө',
                dataIndex: 'roomName',
                key: 'type',
            },
            {
                title: 'Эхлэх цаг',
                dataIndex: 'open_time',
                key: 'open',
            },
            {
                title: 'Үргэлжлэх хугацаа',
                dataIndex: 'duration',
                key: 'duration',
                align: 'center',
            },
            {
                title: 'Үйлдэл',
                key: 'action',
                align: 'center',
                render:  (record) => (
                        <div style={{color: ' #1890ff'}}>
                            <EditOutlined onClick={() => this.selectProgram(record.id)} style={{marginRight: '20px'}}/>
                            <Popconfirm title="Устгах уу?" onConfirm={() => this.deleteProgram(record.id)} okText="Тийм" cancelText="Үгүй">
                                <DeleteOutlined />
                            </Popconfirm>
                        </div>)
            },
        ];
        return (
            <div>
                <Row>
                    <Card title="Хөтөлбөрүүд" bordered={false} style={{ width: '80%' }}>
                        <Row>
                            <Button type="primary" onClick={this.createProgram} style={{ marginBottom: '10px' }}>
                                Хөтөлбөр нэмэх
                            </Button>
                            <Input.Search style={{ marginLeft: '60px', marginBottom: '10px', width: '400px' }} onSearch={(value) => this.onSearch(value)} placeholder="Хөтөлбөр нэрээр хайх.." />
                        </Row>
                        <Table
                            style={{ marginBottom: '24px' }}
                            rowKey="id"
                            columns={columns}
                            dataSource={this.state.programList}
                            pagination={pagination}
                            size={'large'}
                        />

                        <Pagination
                            style={{ marginLeft: '60px' }}
                            defaultPageSize={pageSize}
                            defaultCurrent={1}
                            current={page}
                            total={total}
                            showTotal={(total) => <span>Нийт: {total}</span>}
                            onChange={this.onPageChange}
                        />
                    </Card>
                </Row>
                {showModal && this.programModal()}
            </div>
        );
    }
}

export default EventProgram;
