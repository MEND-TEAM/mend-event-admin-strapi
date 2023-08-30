import { Button, Form, Input, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';

class eventschedules extends React.Component {
    constructor(props) {
        super(props);
        (this.state = {
            room: '',
            time: moment(),
            topic: '',
            title: '',
            event: '',
            eventId: props.id || '',
            addField: [
                {
                    room: ''
                }
            ]
        }),
            (this.handleTimeChange = this.handleTimeChange.bind(this));
    }

    handleRoomChange = e => {
        this.setState({ room: e.target.value });
    };

    handleTopicChange = e => {
        this.setState({ topic: e.target.value });
    };

    handleTitleChange = e => {
        this.setState({ title: e.target.value });
    };

    handleTimeChange(date) {
        this.setState({ time: date });
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields }
        }));
    };

    handleFormLayoutChange = e => {
        this.setState({ formLayout: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        let fieldsvalue = {
            room: this.state.room,
            time: this.state.time.format('YYYY-MM-DD HH:mm'),
            topic: this.state.topic,
            title: this.state.title,
            event: this.props.location.state
        };

        fetch('http://192.168.0.20:1337/eventschedules', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(fieldsvalue)
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
        this.props.form.resetFields();
    };

    onBack = () => {
        window.history.back();
    };

    handleAddSchedule = () => {
        this.setState({
            addField: this.state.addField.concat([{ room: '' }])
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 8 }
            }
        };
        // const data= this.props.location.state
        return (
            <div className="container">
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Өрөө">
                        {getFieldDecorator('room')(<Input />)}
                    </Form.Item>

                    <Form.Item label="Цаг">
                        {getFieldDecorator('time')(<TimePicker />)}
                    </Form.Item>

                    <Form.Item label="Гарчиг">
                        {getFieldDecorator('title')(<Input />)}
                    </Form.Item>

                    <Form.Item label="Сэдэв">
                        {getFieldDecorator('topic')(<Input />)}
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form>

                {/* <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <div>Schedule Create Page</div>
            <Button onClick={this.onBack}>
              <Icon type="left-circle" />
            </Button>
          </Form.Item>

          <Form.Item>
            <Input type='text' value={this.props.location.state} ></Input>
          </Form.Item>

          <Form.Item
            label={'Өрөө'}>
            <Input type='text' value={this.state.room} onChange={this.handleRoomChange}/>
          </Form.Item>

          <Form.Item label="Цаг">
            <DatePicker 
              format="YYYY-MM-DD HH:mm" 
              selected={this.state.time} 
              onChange={this.handleTimeChange}
              name="Time"/>
          </Form.Item>

          <Form.Item
            label={'Сэдэв'}>
            <Input type='text' value={this.state.topic} onChange={this.handleTopicChange}/>
          </Form.Item>

          <Form.Item 
            label="Гарчиг">
            <Input type='text' value={this.state.title} onChange={this.handleTitleChange}/>
          </Form.Item>
          
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button type="primary" onClick={this.handleAddSchedule}>
              Add schedule
            </Button>
          </Form.Item>
        </Form> */}
            </div>
        );
    }
}
// const Wrappedeventschedules = Form.create({ name: 'dynamic_form_item' })(eventschedules);
export default eventschedules;
