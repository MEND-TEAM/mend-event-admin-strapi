import React from 'react';
import { Input, Form, Button, DatePicker, Select, message, Descriptions } from 'antd';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';
import moment from 'moment';
import Api from './api';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

class ProgramGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programId: props.programId || 0,
            eventId: props.eventId || 0,
            roomList: props.roomList || [],
            programType: [],



            id: '',
            title: 'Hello',
            topic: '',
            open_time: '',
            close_time: '',
            description: '',
            eventroom: '',
        };
    }
    formRef = React.createRef();

    async componentDidMount() {
        this.fetchTypesProgram();
        // this.fetchRoomsEvent();
        console.log('programId', this.state.programId)
        if(this.state.programId){
            this.fetchProgramDetail(this.state.programId)
        }
        
    }

    // fetchRoomsEvent = async () => {
    //     let json = await Api.fetchRoomsEvent({event: this.state.eventId})
    //     if(json && !json.code){
    //         console.log('room', json)
    //         this.setState({roomList: json})
    //     } else {
    //         message.warning(
    //             <div>
    //                 Өрөөний мэдээлэл олдсонгүй.
    //                 <br />
    //                 {json.message || ''}
    //             </div>
    //         );
    //     }
    // }

    fetchTypesProgram = async () => {
        let json = await Api.fetchTypesProgram();
        console.log('program type', json)
        if(json && !json.code){
            this.setState({programType: json})
        } else {
            message.warning(
                <div>
                    Хөтөлбөрийн төрлийн мэдээлэл олдсонгүй.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    }

    fetchProgramDetail = async (programId) => {
        let json = await Api.fetchProgram({ programId });
        console.log('json', json)
        console.log('generalInfo roomlist', this.state.roomList)

        if (json && !json.code) {
            let room = this.state.roomList.find((el)=>{return el.id == (json.eventroom || 0)})
            let type = json.program_type != "undefined" ? json.program_type : ''
            this.formRef.current.setFieldsValue({
                title: json.title || '',
                topic: json.topic || '',
                type,
                description: json.description || '',
                room: (room || {}).room_number || '',
                open_time: moment.utc(json.open_time || moment().format()),
                close_time: moment.utc(json.close_time || moment().format()),
            });
        } else {
            message.warning(
                <div>
                    Хөтөлбөрийн мэдээлэл олдсонгүй.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    };

    async onFinish(values) {
        this.setState({ creating: true });
        const formData = new FormData();
        //TODO: validate
        console.log('type', values.type)
        let params = {
            title: values.title,
            topic: values.topic,
            description: values.description,
            open_time: values.open_time.format(),
            close_time: values.close_time.format(),
            program_type: values.type || '',
            eventroom: values.room
        };
        for (const name in params) {
            formData.append(name, params[name]);
        }
        // if(this.state.bannerImg.length > 0){
        //     formData.append('picture', this.state.bannerImg[0])
        // }

        let json = ''

        if(this.state.programId) { // update speaker
            json = await Api.updateProgramDetails({programId: this.state.programId, formData})
        } else { //create new speaker
            formData.append('event', this.state.eventId)
            json = await Api.createProgram({formData})
        }
        console.log('program', json)
        if (json && !json.code) {
            this.setState({ creating: false });
            // this.formRef.current.resetFields();
            this.props.onSuccess();
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
            this.setState({ creating: false });
        }
    }





    titleOnChange = (event) => {
        this.setState({ ...this.state, title: event.target.value });
    };

    topicOnChange = (event) => {
        this.setState({ ...this.state, topic: event.target.value });
    };

    openTimeOnChange = (event) => {
        this.setState({ ...this.state, open_time: event.target.value });
    };

    closeTimeOnChange = (event) => {
        this.setState({ ...this.state, close_time: event.target.value });
    };

    descriptionOnChange = (event) => {
        this.setState({ ...this.state, description: event.target.value });
    };

    roomOnChange = (event) => {
        this.setState({ ...this.state, eventroom: event.target.value });
    };

    programTypeChange = (value) => {
        this.setState({ ...this.state, program_type: value });
    };

    render() {
        const { title, topic, open_time, close_time, eventroom, roomList, description, program_type } = this.state;
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
        return (
            <div className="event-list">
                <Form ref={this.formRef} onFinish={(vals) => this.onFinish(vals)} {...formItemLayout}>

                    <input type="hidden" name="userId" value={this.props.userId} />
                    <div className="event-list">
                        <div className="">
                            <Form.Item label="Гарчиг" name="title">
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="">
                            <Form.Item label="Сэдэв" name="topic">
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                        <div className="">
                            <Form.Item label="Хөтөлбөрийн дэлгэрэнгүй" name="description">
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                        <div className="">
                            <Form.Item label="Эхлэх цаг" name="open_time" >
                                {/* <Input style={{ width: '60%' }}/> */}
                                <DatePicker format="YYYY-MM-DD HH:mm" />
                            </Form.Item>
                        </div>

                        <div className="">
                            <Form.Item label="Дуусах цаг" name="close_time" >
                                {/* <Input style={{ width: '60%' }}/> */}
                                <DatePicker format="YYYY-MM-DD HH:mm" />
                            </Form.Item>
                        </div>

                        

                        <div className="">
                            <Form.Item label="Хөтөлбөрийн төрөл" name="type" valuePropName="value">
                                <Select style={{ width: '60%' }}>
                                    {this.state.programType.map((program_type) => {
                                        return <Option value={program_type} key={program_type}>{program_type}</Option>;
                                    })}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="">
                            <Form.Item label="Өрөө" name="room" valuePropName="value">
                                <Select style={{ width: '60%' }} >
                                    {this.state.roomList.map((room) => {
                                        return <Option value={room.id} key={room.id}>{room.room_number}</Option>;
                                    })}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="">
                            <Form.Item {...customItemLayout}>
                                <Button htmlType="submit" type="primary">
                                    {this.state.programId != 0 ? "Засах" : "Нэмэх"}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}
// const WrappedProgramUpdate= Form.create({name: 'updateProgram'})(ProgramGeneralInfo)
export default ProgramGeneralInfo;
