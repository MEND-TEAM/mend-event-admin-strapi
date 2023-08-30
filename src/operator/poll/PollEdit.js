import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, Form, Input, Button, message, Icon } from 'antd';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';

let id = 0;

class PollEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: props.selectedEvent || '',
            programId: props.selectedProgram || '',
            answerList: {},
            id: this.props.id,
            question: '',
            description: ''
        };
    }

    async componentDidMount() {
        console.log('id: -----', this.props.id);
        let { id } = this.state;
        if (id) {
            let question = await axios
                .get(`${config.API_DOMAIN}/eventpolls/list?id=${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    return response.data[0].question;
                })
                .catch(function(error) {
                    console.log(error);
                    return '';
                });

            let options = await axios
                .get(
                    `${config.API_DOMAIN}/eventpolloptions/list?event_poll=${id}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + Auth.getToken()
                        }
                    }
                )
                .then(function(response) {
                    console.log('response optionlist: ', response.data);
                    let answerList = {};
                    response.data.map(option => {
                        id++;
                        answerList[id] = {};
                        answerList[id].option = option.option_name;
                        answerList[id].answer = option.description;
                    });
                    return answerList;
                })
                .catch(function(error) {
                    console.log(error);
                    return [];
                });
            this.setState({
                question,
                answerList: options
            });
        }
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
        answerList[id].option = String.fromCharCode(
            64 + Object.keys(answerList).length
        );
        answerList[id].question = '';
        this.setState({ answerList });
    };

    onChange = (event, key) => {
        let { answerList } = this.state;
        if (answerList[key]) {
            answerList[key].answer = event.target.value;
            this.setState({ answerList });
        }
    };

    save = async event => {
        event.preventDefault();
        const { eventId, programId, question, answerList, id } = this.state;
        const data = {
            pollId: id,
            event: eventId,
            eventprogram: programId,
            question,
            optionList: answerList
        };
        let url = '/eventpolls/customCreate';
        if (id) {
            url = '/eventpolls/customUpdate';
        }

        const self = this;
        await axios
            .post(`${config.API_DOMAIN}${url}`, data, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            })
            .then(function(response) {
                if (response.data.result) {
                    message.success('Амжилттай');
                    self.setState({
                        id: response.data.data.eventPoll.id
                    });
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function(error) {
                message.error('Алдаа гарлаа catch errro');
                console.log(error);
            });
    };

    questionOnChange = event => {
        this.setState({ question: event.target.value });
    };

    render() {
        console.log('polloptions:  ', this.state.answerList);
        const { answerList } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 }
            }
        };

        const customItemLayout = {
            wrapperCol: {
                xs: { span: 12, offset: 6 },
                sm: { span: 12, offset: 6 }
            }
        };

        const { getFieldDecorator } = this.props.form;
        const formItems = Object.keys(answerList).map((key, index) => {
            return (
                <Form.Item label={answerList[key].option} required={false}>
                    {getFieldDecorator(`answer-[${key}]`, {
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Хариулт оруулна уу эсвэл устган уу.'
                            }
                        ],
                        initialValue: answerList[key].answer
                    })(
                        <Input
                            placeholder="Хариулт"
                            onChange={event => {
                                this.onChange(event, key);
                            }}
                            style={{ width: '60%', marginRight: 8 }}
                        />
                    )}

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
            <div>
                <Form
                    id="add-poll-form"
                    onSubmit={this.save}
                    {...formItemLayout}>
                    <Form.Item label="Асуулт">
                        <textarea
                            style={{ lineHeight: '120%' }}
                            name="test-input"
                            rows="3"
                            cols="50"
                            value={this.state.question}
                            onChange={this.questionOnChange}></textarea>
                    </Form.Item>

                    <Form.Item label="Хариулт"></Form.Item>
                    {formItems}
                    <Form.Item {...customItemLayout}>
                        <Button
                            type="dashed"
                            onClick={this.add}
                            style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </Form.Item>

                    <Form.Item {...customItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Хадгалах
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const store = state => ({
    selectedEvent: state.app.selectedEvent,
    selectedProgram: state.app.selectedProgram
});

// const WrappedPollEdit = Form.create({ name: 'dynamic_form_item' })(PollEdit);
export default connect(store)(PollEdit);
