import React from 'react';
import { Button, Card, Checkbox, Col, Form, Input, Image, message, Row, Select, Spin, Switch, Table, Upload } from 'antd';
import config from '../../config';

import Api from './api';

const { TextArea } = Input;
const mimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'] //accepted mime types
const apiDomain = config.API_DOMAIN;

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

class CreateSpeaker extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef(),
        this.state = {
            eventId: props.eventId || '',
            speakerId: props.speakerId || 0,
            bannerImg: [],
            imgUrl: '',
            fetching: false,
        };
    }
    
    
    componentDidMount() {
        // console.log('speakerId', this.state.speakerId)
        if(this.state.speakerId != 0){
            this.fetchSpeakerInfo();
        }
    }

    fetchSpeakerInfo = async () => {
        this.setState({fetching: true})
        console.log('formRef', this.formRef)
        let json = await Api.fetchSpeakerById({id: this.state.speakerId})
        if (json ){
            if  (json.length > 0){
                let banner = (json[0].picture || {}).url || ''
                this.formRef.current.setFieldsValue({
                    event_name: json[0].name || '',
                    position: json[0].position || '',
                    description: json[0].description || '',
                    isfeatured: json[0].isfeatured || false,
                });
                this.setState({fetching: false, imgUrl: banner ? apiDomain + banner : ''})
            } else {
                message.warning(
                    <div>
                        Оролцогчийн мэдээлэл олдсонгүй.
                        <br />
                        {json.message || ''}
                    </div>
                );
                this.setState({ fetching: false });
            }
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || ''}
                </div>
            );
            this.setState({ fetching: false });
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

    async onFinish(values) {
        this.setState({ creating: true });
        const formData = new FormData();
        //TODO: validate
        let params = {
            name: values.event_name,
            position: values.position,
            description: values.description,
            isfeatured: values.isfeatured,
            
        };
        for (const name in params) {
            formData.append(name, params[name]);
        }
        if(this.state.bannerImg.length > 0){
            formData.append('picture', this.state.bannerImg[0])
        }
        let json = ''
        if(this.state.speakerId) { // update speaker
            formData.append('id',this.state.speakerId)
            json = await Api.updateSpeaker(formData)
        } else { //create new speaker
            formData.append('event',this.state.eventId)
            json = await Api.createSpeaker(formData);
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
            <div className="container" style={{ padding: '0px 30px 0px 30px' }}>
                
                <Form ref={this.formRef} onFinish={(vals) => this.onFinish(vals)} {...formItemLayout}>
                    {this.state.fetching ? <Spin /> : <div> 
                        <Form.Item label="Нэр" name="event_name">
                        <Input type="text" />
                        </Form.Item>

                        <Form.Item label="Албан тушаал" name="position">
                            <Input type="text" />
                        </Form.Item>

                        <Form.Item label="Онцлох" name="isfeatured" valuePropName="checked">
                            <Switch defaultChecked={true} />
                        </Form.Item>
                        <Form.Item label="Тухай" name="description">
                            <TextArea rows="10" />
                        </Form.Item>
                        {this.state.imgUrl && 
                            <Form.Item {...customItemLayout}>
                                <Image width={200} src={this.state.imgUrl}/>
                            </Form.Item>}
                        <UploadImage bannerImg={this.state.bannerImg} onChange={(ev) => {this.onChange(ev)}} onRemove={(ev) => this.onRemove(ev)}/>

                        <Form.Item {...customItemLayout}>
                            <Button htmlType="submit" type="primary">
                                Хадгалах
                            </Button>
                        </Form.Item>
                    </div>}
                </Form>
            </div>
        );
    }
}
export default CreateSpeaker;
