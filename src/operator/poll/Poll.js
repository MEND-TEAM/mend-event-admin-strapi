import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Icon, Button, Card, Row, List, Col, message } from 'antd';
import config from '../../config';
import axios from 'axios'
import Auth from '../lib/auth'
import { fileToObject } from 'antd/lib/upload/utils';
import PollResult from './PollResult';

let id = 0;

class Poll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: props.eventId || '',
            programId: props.programId || '',
            answerList: {},
            id: '',
            question: '',
            description: '',
            eventpolls: [],
            polloptions: [],
            checkid: [],
            pollResult: false,
            selectedPollId: '',
            selectedQuestion: ''
        }
    }

    componentDidMount() {
        this.fetchpoll();
    }

    showPollResult = (pollId, question) => {
        this.setState({ pollResult: true, selectedPollId: pollId, selectedQuestion: question });
    }

    hidePollResult = () => {
        this.setState({ pollResult: false });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.programId !== this.props.programId) {
            this.fetchpoll();
        }
    }

    fetchpoll = async () => {
        const self = this;
        await axios.get(`${config.API_DOMAIN}/eventpolls/list?eventprogram=${this.props.programId}`, {}, {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    const eventpolls = response.data;
                    self.setState({
                        eventpolls
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    remove = index => {
        let { answerList } = this.state;
        delete answerList[index];
        this.setState({ answerList });
    };

    add = () => {
        let { answerList } = this.state;
        id++;
        answerList[id] = {};
        answerList[id].option = String.fromCharCode(64 + Object.keys(answerList).length);
        answerList[id].question = '';
        this.setState({ answerList });
    };

    onChange = (event, key) => {
        let { answerList } = this.state;
        if (answerList[key]) {
            answerList[key].answer = event.target.value;
            this.setState({ answerList });
        }
    }

    save = (event) => {
        event.preventDefault();
        const { eventId, programId, question, answerList } = this.state;
        const data = {
            event: eventId,
            eventprogram: programId,
            question,
            optionList: answerList
        };
        axios.post(`${config.API_DOMAIN}/eventpolls/customCreate`, data, {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
            .then(function (response) {
                message.success("Successfully inserted");
                console.log('pollId: ', response);
            })
            .catch(function (error) {
                message.error("Error");
                console.log(error);
            });
    }

    questionOnChange = (event) => {
        this.setState({ question: event.target.value });
    }

    renderPollResult = () => {
        if (this.state.pollResult) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    position: 'fixed',
                    top: '0px',
                    left: '0px',
                    width: '100%',
                    height: '100vh',
                    zIndex: '10000'
                }}>
                    <PollResult question={this.state.selectedQuestion} pollId={this.state.selectedPollId} hidePollResult={this.hidePollResult}/>
                </div>
            );
        }

        return '';
    }

    render() {
        console.log("POLL", this.state)
        const { eventpolls, polloption } = this.state
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
        }

        const { answerList } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItems = Object.keys(answerList).map((key, index) => {
            return (
                <Form.Item
                    label={answerList[key].option}
                    required={false}
                >
                    {getFieldDecorator(`answer-[${key}]`, {
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Хариулт оруулна уу эсвэл устган уу.",
                            },
                        ],
                    })(<Input placeholder="Хариулт" onChange={(event) => { this.onChange(event, key); }} style={{ width: '60%', marginRight: 8 }} />)}

                    <Icon
                        id={`answer-icon-${key}`}
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(key)}
                    />

                </Form.Item>
            );
        });
        return (
            <div style={{ background: 'white', padding: '30px', marginRight: '60px' }}>
                {/* <h1>{this.props.eventId}</h1> */}
                <Row gutter={16}>
                    <Col span={12} >
                        <Card title="Асуулт нэмэх" bordered={false}>
                            <div className="addQuestion">
                                <Form id="add-poll-form" onSubmit={this.save} {...formItemLayout}>
                                    <Form.Item label="Асуулт">
                                        <Input type="text" style={{ width: "60%" }} name="test-input"
                                            value={this.state.question} onChange={this.questionOnChange}></Input>
                                    </Form.Item>

                                    <Form.Item label="Хариулт">
                                    </Form.Item>
                                    {formItems}
                                    <Form.Item {...customItemLayout} >
                                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                            <Icon type="plus" /> Add field
                                        </Button>
                                    </Form.Item>

                                    <Form.Item {...customItemLayout}>
                                        <Button type="primary" htmlType="submit"> Submit</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Асуулт " bordered={false}>
                            <List
                                itemLayout="horizontal"
                                dataSource={eventpolls}
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 6,
                                }}
                                renderItem={poll => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={poll.question}
                                        />
                                        <Button type="primary" size="small" onClick={() => { this.showPollResult(poll.id, poll.question)} }>Харах</Button>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                {this.renderPollResult()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let id = ((ownProps.match || {}).params || {}).id || ''
    return {
        id,
    }
}
// const WrappedPoll = Form.create({ name: 'dynamic_form_item' })(Poll);
export default connect(mapStateToProps)(Poll);