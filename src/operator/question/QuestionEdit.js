import { Button, Checkbox, Form, InputNumber, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import config from '../../config';
import Auth from '../../lib/auth';

class QuestionEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            answered: false,
            confirmed: false,
            ordered: false,
            question: '',
            order: ''
        };
    }

    async componentDidMount() {
        let { id } = this.state;
        const self = this;
        if (id) {
            await axios
                .get(`${config.API_DOMAIN}/eventquestions/list?id=${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {
                    let eventQuestion = response.data[0];
                    self.setState({
                        answered: eventQuestion.answered,
                        confirmed: eventQuestion.confirmed,
                        order: eventQuestion.order,
                        question: eventQuestion.question,
                        ordered: eventQuestion.order ? true : false
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }

    save = async event => {
        event.preventDefault();
        const self = this;
        let { id, answered, confirmed, order, question, ordered } = this.state;
        let data = {};
        data.id = id;
        data.answered = answered;
        data.confirmed = confirmed;
        data.question = question;
        if (ordered && order) {
            data.order = order;
        }
        data.event = this.props.selectedEvent;
        data.event_program = this.props.selectedProgram;
        await axios
            .post(`${config.API_DOMAIN}/eventquestions/customUpdate?`, data, {
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            })
            .then(function(response) {
                if (response.data.result) {
                    self.setState({ id: response.data.data.eventQuestion.id });
                    message.success('Амжилттай');
                } else {
                    message.error('Алдаа гарлаа');
                }
            })
            .catch(function(error) {
                console.log(error);
                message.error('Алдаа гарлаа');
            });
    };

    orderedOnChange = event => {
        this.setState({ ordered: event.target.checked });
    };

    answeredOnChange = event => {
        this.setState({ answered: event.target.checked });
    };

    confirmedOnChange = event => {
        this.setState({ confirmed: event.target.checked });
    };

    questionOnChange = event => {
        this.setState({ question: event.target.value });
    };

    orderOnChange = value => {
        this.setState({ order: value });
    };

    render() {
        console.log('order value: ', this.state.order);
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
            labelCol: {
                xs: { span: 12, offset: 6 },
                sm: { span: 12, offset: 6 }
            },
            wrapperCol: {
                xs: { span: 12, offset: 6 },
                sm: { span: 12, offset: 6 }
            }
        };

        return (
            <div>
                <Form
                    {...customItemLayout}
                    layout="vertical"
                    onSubmit={this.save}>
                    <Form.Item>
                        <label>Aсуулт: </label>
                        <textarea
                            rows="6"
                            cols="60"
                            value={this.state.question}
                            style={{ lineHeight: '120%', padding: '8px' }}
                            onChange={this.questionOnChange}></textarea>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox
                            checked={this.state.ordered}
                            onChange={this.orderedOnChange}>
                            Асуух дараалал
                        </Checkbox>{' '}
                        <br />
                        <InputNumber
                            name="order"
                            type="number"
                            style={{ width: '60%', marginTop: '10px' }}
                            onChange={this.orderOnChange}
                            value={this.state.order ? this.state.order : ''}
                            disabled={!this.state.ordered}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox
                            checked={this.state.answered}
                            onChange={this.answeredOnChange}>
                            Хариулсан эсэх
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox
                            checked={this.state.confirmed}
                            onChange={this.confirmedOnChange}>
                            Зөвшөөрөгдсөн эсэх
                        </Checkbox>
                    </Form.Item>
                    <Form.Item {...customItemLayout}>
                        <Button htmlType="submit" type="primary">
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

export default connect(store)(QuestionEdit);
