import React from 'react';
import { Button, Card, Checkbox, Col, Form, Image, Input, message, Row, Select, Table, Upload } from 'antd';
import config from '../../config';
import axios from 'axios';
import Auth from '../../lib/auth';
import Api from '../room/api';

const apiDomain = config.API_DOMAIN;
const mimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'] //accepted mime types

const UploadImage = props => {
    const { bannerImg, onChange, onRemove } = props;
    const pprops = {
        onRemove: (file) => {
            onRemove(file)
        },
        beforeUpload: (file) => {
            //if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
            if (mimes.indexOf(file.type) < 0) {
                message.error(`png, jpg, jpeg, webp, gif форматууд зөвшөөрөгдөнө`);
                return false
            }
            onChange([file]);
            return false;
        },
        fileList: bannerImg,
    };
    return (<div className="">
        <Form.Item label="Зураг">
            <Upload multiple={false} {...pprops} style={{ width: '30%', padding: '0px' }}> <Button>Зураг сонгох</Button> </Upload>
        </Form.Item>
    </div>);
};

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            eventId: props.eventId || '',
            purpose: props.purpose || '',
            roomId: props.roomId || 0,
            bannerImg: [],
        }
    }

    componentDidMount() {
        if(this.state.purpose == 'update' && this.state.roomId != 0){
            this.fetchRoomInfo()
        }
    }

    fetchRoomInfo = async () => {
        let json = await Api.fetchRoomInfo({id: this.state.roomId})
        if(json && !json.code) {
            let room = json[0] || {}
            this.setState({imgUrl: room.room_location_img || ''})
            this.formRef.current.setFieldsValue({
                room_number: room.room_number || '',
                room_location: room.room_location || '',
            });
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    }

    onFinish = async (values) => {
        this.setState({ creating: true });
        const formData = new FormData();
        //TODO: validate
        let params = {
            room_number: values.room_number,
            room_location: values.room_location,
        };
        for (const name in params) {
            formData.append(name, params[name]);
        }
        if(this.state.bannerImg.length > 0){
            formData.append('room_location_img', this.state.bannerImg[0])
        }
        let json = {}

        if(this.state.purpose == 'update') { // update speaker
            formData.append('id',this.state.roomId)
            json = await Api.updateRoom({formData})
        } else if(this.state.purpose == 'create'){ //create new speaker
            formData.append('event',this.state.eventId)
            json = await Api.createRoom({formData});
        }

        if (json && json.result) {
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
    onChange = (e) => {
        this.setState({
            bannerImg: e || []
        });
    };

    onRemove = (e) => {
        this.setState({
            bannerImg: []
        });
    }

    render() {
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
            <div  className="container" style={{ padding: '0px 30px 0px 30px' }}>
                <Form ref={this.formRef} onFinish={(vals) => this.onFinish(vals)} {...formItemLayout}>
                    <Form.Item label="Өрөөний нэр" name="room_number">
                        <Input type='text' name="room_number" style={{ width: "80%" }} />
                    </Form.Item>

                    <Form.Item label="Өрөөний байршил" name="room_location">
                        <Input type='text'  style={{ width: "80%" }} />
                    </Form.Item>
                    {this.state.imgUrl && 
                        <Form.Item {...customItemLayout}>
                            <Image width={200} src={apiDomain + this.state.imgUrl}/>
                        </Form.Item>}
                    {/* <Form.Item label="Өрөөний байршлын зураг">
                        <input type='file' name="room_location_img" style={{ width: "60%", padding: '0px' }} />
                    </Form.Item> */}
                    
                    <UploadImage bannerImg={this.state.bannerImg} onChange={(ev) => {this.onChange(ev)}} onRemove={(ev) => this.onRemove(ev)}/>
                    
                    <Form.Item >
                        <Input type='hidden' name="event" style={{ width: "40%" }}
                            value={this.state.eventId} ></Input>
                    </Form.Item>
                    <Form.Item {...customItemLayout}>
                        <Button htmlType="submit" type="primary" style={{ width: "40%" }}>Хадгалах</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default CreateRoom;