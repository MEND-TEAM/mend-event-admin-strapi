import React from 'react';
import { Avatar, Card, Col, Row, List, Form, Select, Button, Input, message, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import config from '../../config';
import Api from './api';

const apiDomain = config.API_DOMAIN;
const { Option } = Select;
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
class ProgramSpeaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId || '',
            programId: props.programId || '',
            speakerList: [],
            roleType: [],
            eventSpeakers: [],
            selectedSpeaker: {},

            eventSpeaker: [],
            programList: '',
            eventProgram: [],

            role: '',
            event_speaker: '',
            selectedSpeakers: [],
        };
        this.formRef = React.createRef();
    }

    async componentDidMount() {
        this.fetchSpeakersByEvent();
        this.fetchRoles();
    }

    fetchSpeakersByEvent = async () => {
        let json = await Api.fetchSpeakersByEvent({ event: this.state.eventId });

        if (json && !json.code) {
            this.setState({ speakerList: json });
            this.fetchProgramSpeaker(json);
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchSpeakersByEvent'}
                </div>
            );
        }
    };

    fetchRoles = async () => {
        let json = await Api.fetchRoles();
        if (json && !json.code) {
            this.setState({ roleType: json });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchRoles'}
                </div>
            );
        }
    };

    fetchProgramSpeaker = async (speakerList) => {
        let json = await Api.fetchSpeakersByProgram({ event_program: this.state.programId });
        if (json && json.result) {
            let attends = json.data.map((el) => {
                let s = speakerList.find((s) => {
                    return s.id == el.event_speaker;
                });
                return { ...s, role: el.role, did: el.id };
            });

            this.setState({ selectedSpeakers: attends });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchProgramSpeaker'}
                </div>
            );
        }
    };

    handleSubmit = async (values) => {
        let has = this.state.selectedSpeakers.find((s) => {
            return s.id == values.event_speaker;
        });
        if (has) {
            message.warning(<div>Энэ илтгэгч өмнө нь холбогдсон байна.</div>);
            return;
        }
        const speakerRole = {
            role: values.role,
            event_program: this.state.programId,
            event_speaker: values.event_speaker,
        };

        let json = await Api.insertSpeakerProgram(speakerRole);
        if (json && !json.code) {
            this.fetchProgramSpeaker(this.state.speakerList);
            this.formRef.current.setFieldsValue({
                role: '',
                event_speaker: '',
            });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchProgramSpeaker'}
                </div>
            );
        }
    };

    removeSpeaker = async (data) => {
        let { did } = data;
        let json = await Api.removeSpeakerFromProgram({ id: did });
        if (json && !json.code) {
            this.fetchProgramSpeaker(this.state.speakerList);
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'Can not remove binding'}
                </div>
            );
        }
    };

    render() {
        const { role, event_speaker, event_program, selectedSpeakers } = this.state;
        const { speakerList, roleType } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '10px', marginRight: '60px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Хөтөлбөрт оролцогч сонгох" bordered={false}>
                            <Form ref={this.formRef} onFinish={this.handleSubmit} {...formItemLayout}>
                                <Form.Item label="Илтгэгч" name="event_speaker" valuePropName="value">
                                    <Select showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {speakerList.map((speaker) => {
                                            return <Option key={speaker.id} value={speaker.id}>{speaker.name}</Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Role" name="role" valuePropName="value">
                                    <Select>
                                        {roleType.map((role) => {
                                            return <Option key={role} value={role}>{role}</Option>;
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item {...customItemLayout}>
                                    <Button htmlType="submit" type="primary">
                                        Нэмэх
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Оролцогчид" bordered={false}>
                            <List
                                itemLayout="horizontal"
                                dataSource={selectedSpeakers}
                                pagination={{ pageSize: 6 }}
                                renderItem={(data) => (
                                    <List.Item key={data.id}>
                                        <List.Item.Meta avatar={<Avatar src={`${apiDomain}${data.picture}`} icon={<UserOutlined />} />} title={data.name} description={data.role} />
                                        <Popconfirm
                                            title="Холболтыг салгах уу?"
                                            onConfirm={() => {
                                                this.removeSpeaker(data);
                                            }}
                                            okText="Тийм"
                                            cancelText="Үгүй">
                                            <DeleteOutlined style={{ color: '#1890ff' }} />
                                        </Popconfirm>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default ProgramSpeaker;
