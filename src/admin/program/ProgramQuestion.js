import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Form, Input, Icon, Button, Card, Col, Pagination, Popconfirm, Row, Select, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';
import Api from './api';
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

const _limit = 5;
class ProgramQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: props.eventId || '',
            programId: props.programId || '',
            speakerList: [],
            eventquestions: [],
            totalQuestion: 0,
            page: 1,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.fetchSpeakersByEvent();
        this.fetchEventQuestionTotal();
    }

    fetchSpeakersByEvent = async () => {
        let json = await Api.fetchSpeakersByEvent({ event: this.state.eventId });

        if (json && !json.code) {
            this.setState({ speakerList: json });
            this.fetchEventQuestion({page: 1});
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
    fetchEventQuestionTotal = async () => {
        let json = await Api.countQuestions({ event_program: this.state.programId, confirmed: 'confirmed' });
        if ((json || json == 0) && !json.code) {
            this.setState({ totalQuestion: json });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'count question error'}
                </div>
            );
        }
    };

    fetchEventQuestion = async ({page = 1}) => {
        let _start = (page - 1) * _limit;
        let params = {_start, _limit, _sort: 'created_at:desc' }
        let json = await Api.fetchQuestions({ event_program: this.state.programId, confirmed: 'confirmed', ...params });
        if (json && !json.code) {
            let eventquestions = json.map((q) => {
                let speaker = this.state.speakerList.find((s) => {
                    return s.id == q.eventspeaker;
                });
                return { ...q, speaker: (speaker || {}).name || '' };
            });
            this.setState({ eventquestions });
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchEventQuestion'}
                </div>
            );
        }
    };

    onPageChange = (page) => {
        if (this.state.page !== page)  {
            this.setState({ page, loading: true });
            this.fetchEventQuestion({page});
        }
    };

    handleSubmit = async (values) => {
        let params = {
            event: this.state.eventId,
            event_program: this.state.programId,
            question: values.question,
            confirmed: 'confirmed',
        };
        if (values.event_speaker) {
            params.eventspeaker = values.event_speaker;
        }


        let json = await Api.createQuestion(params);
        if (json && !json.code) {
            this.fetchEventQuestionTotal();
            this.fetchEventQuestion({page: 1});
            this.formRef.current.setFieldsValue({
                question: '',
                event_speaker: ''
            })
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'create question'}
                </div>
            );
        }
    };

    removeQuestion = async (question) => {
        let json = await Api.removeQuestion(question);
        if(json && !json.code){
            this.fetchEventQuestionTotal();
            this.fetchEventQuestion({page: this.state.page});
        } else {
            message.warning(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'create question'}
                </div>
            );
        }

    };

    render() {
        const { eventquestions, speakerList, page, totalQuestion } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '10px', marginRight: '60px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Асуулт нэмэх" bordered={false}>
                            <div className="addQuestion">
                                <Form ref={this.formRef} onFinish={this.handleSubmit} {...formItemLayout}>
                                    <Form.Item label="Асуулт" name="question">
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                    <Form.Item label="Хэнээс" name="event_speaker" valuePropName="value">
                                        <Select showSearch optionFilterProp="children" filterOption={(input, option) => Select.Option.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {speakerList.map((speaker) => {
                                                return <Option value={speaker.id} key={speaker.id}>{speaker.name}</Option>;
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item {...customItemLayout}>
                                        <Button type="primary" htmlType="submit">
                                            {' '}
                                            Нэмэх
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Асуултын жагсаалт" bordered={false}>
                            <List
                                itemLayout="horizontal"
                                dataSource={eventquestions}
                                renderItem={(question) => (
                                    <List.Item
                                        key={question.id}
                                        actions={[
                                            <Popconfirm
                                                title="Устгах уу?"
                                                onConfirm={() => {
                                                    this.removeQuestion(question);
                                                }}
                                                okText="Тийм"
                                                cancelText="Үгүй">
                                                <Button type="link" icon={<DeleteOutlined style={{ color: '#1890ff' }} />} />
                                            </Popconfirm>,
                                        ]}>
                                        <List.Item.Meta title={question.question} description={question.speaker ? 'Хэнээс: ' + question.speaker : ''} />
                                    </List.Item>
                                )}>
                            </List>
                            <Pagination defaultPageSize={_limit} current={page} total={totalQuestion} 
                                showTotal={(totalQuestion) => <span>Нийт: {totalQuestion}</span>} onChange={this.onPageChange} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    let id = ((ownProps.match || {}).params || {}).id || '';
    return {
        id,
    };
};
export default connect(mapStateToProps)(ProgramQuestion);
