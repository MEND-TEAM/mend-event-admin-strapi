import React, { useState } from 'react';
import { connect } from 'react-redux';
import config from '../../config';

import { Button, Card, Col, DatePicker, Form, Image, Input, message, Row, Switch, Tabs, Upload } from 'antd';
import moment from 'moment';

import Api from './api';

const apiDomain = config.API_DOMAIN;
const mimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'] //accepted mime types

const UploadBanner = props => {
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
const UploadBuilding = props => {
    const { buildingImg, onChange, onRemove } = props;
    const pprops = {
        onRemove: (file) => {
            onRemove(file)
        },
        beforeUpload: (file) => {
            if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
                message.error(`png, jpg, jpeg, webp форматууд зөвшөөрөгдөнө`);
                return false
            }
            onChange([file]);
            return false;
        },
        fileList: buildingImg,
    };
    return (<div className="">
        <Form.Item label="Барилгын зураг">
            <Upload {...pprops} style={{ width: '30%', padding: '0px' }}> <Button>Зураг сонгох</Button> </Upload>
        </Form.Item>
    </div>);
};
const UploadLocation = props => {
    const { locationImg, onChange, onRemove } = props;
    const pprops = {
        onRemove: (file) => {
            onRemove(file)
        },
        beforeUpload: (file) => {
            if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
                message.error(`png, jpg, jpeg, webp форматууд зөвшөөрөгдөнө`);
                return false
            }
            onChange([file]);
            return false;
        },
        fileList: locationImg,
    };
    return (<div className="">
        <Form.Item label="Байршлын зураг">
            <Upload {...pprops} style={{ width: '30%', padding: '0px' }}> <Button>Зураг сонгох</Button> </Upload>
        </Form.Item>
    </div>);
};
class EventEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event_id: props.eventId,

            bannerImg: [],
            buildingImg: [],
            locationImg: [],
            uploading: false,
            finishUpload: false,

            bannerUrl: '',
            buildingUrl: '',
            locationUrl: ''
        };
    }

    formRef = React.createRef();

    fetchEventDetails = async () => {
        let json = await Api.fetchEventDetails({ eventId: this.state.event_id });
        // console.log('json', json);
        if (json && !json.code) {
            //TODO: add code param to api response
            //   this.setState({total: json})
            let banner = (json.banner[0] || {}).url || ''
            let building = (json.building[0] || {}).url || ''
            let location = (json.location || {}).url || ''
            this.setState({bannerUrl: banner ? apiDomain + banner : ''})
            this.setState({buildingUrl: building ? apiDomain + building : ''})
            this.setState({locationUrl: location ? apiDomain + location : ''})

            this.formRef.current.setFieldsValue({
                event_name: json.name || '',
                general_info: json.general_info || '',
                open_time: moment.utc(json.open_time || moment().format()),
                close_time: moment.utc(json.close_time || moment().format()),
                location_desc: json.location_desc || '',
                is_draft: json.is_draft == false ? false : true,
                // banner: json.banner.map((img)=>{return img.url}),
                // location: json.location.url,
                // building: json.building.map((img)=> {return img.url})
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
    };

    async componentDidMount() {
        this.fetchEventDetails();
    }
    
    async onFinish(values) {
        this.setState({ finishUpload: true });
        const formData = new FormData();
        //TODO: validate
        let params = {
            id: this.state.event_id,
            name: values.event_name,
            general_info: values.general_info,
            location_desc: values.location_desc,
            open_time: values.open_time.format(),
            close_time: values.close_time.format(),
            is_draft: values.is_draft
        };

        for (const name in params) {
            formData.append(name, params[name]);
        }
        if(this.state.bannerImg.length > 0){
            formData.append('banner', this.state.bannerImg[0])
        }
        if(this.state.buildingImg.length > 0){
            formData.append('building', this.state.buildingImg[0])
        }
        if(this.state.locationImg.length > 0){
            formData.append('location', this.state.locationImg[0])
        }
        let json = await Api.updateEventDetails(formData)
        console.log('json', json)
        if(json && json.result){
            this.setState({finishUpload: false})
            this.fetchEventDetails()
        } else {
            message.error(<div>Алдаа гарав.<br />{json.message || ''}</div>)
            this.setState({finishUpload: false})
        }
    }

    onChange = (e, t) => {
        if(t == 'banner'){
            this.setState({
                bannerImg: e || []
            });
        } else if (t == 'building') {
            this.setState({
                buildingImg: e || []
            });
        } else if (t == 'location') {
            this.setState({
                locationImg: e || []
            })
        }
    };

    onRemove = (e, t) => {
        if(t == 'banner'){
            this.setState({
                bannerImg: []
            });
        } else if (t == 'building') {
            this.setState({
                buildingImg: []
            });
        } else if (t == 'location') {
            this.setState({
                locationImg: []
            })
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
            <div style={{ marginRight: '60px' }}>
                <Card title="Ерөнхий мэдээлэл" bordered={false}>
                    <div >
                        <Form ref={this.formRef} id="general-form" {...formItemLayout} onFinish={(vals) => this.onFinish(vals)}>
                            <input type="hidden" name="userId" value={this.props.userId} />
                            <div >
                                <div className="">
                                    <Form.Item label="Эвентийн нэр" name="event_name" rules={[{ message: 'Эвэнтийн нэр оруулна уу' }]}>
                                        <Input type="text" style={{ width: '60%' }} />
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item label="Дэлгэрэнгүй" name="general_info" rules={[{ message: 'Овог оруулна уу' }]}>
                                        <Input type="text" style={{ width: '60%' }} />
                                    </Form.Item>
                                </div>
                                <div className="">
                                    <Form.Item label="Байршил" name="location_desc" rules={[{ message: 'Байршил оруулна уу' }]}>
                                        <Input type="text" style={{ width: '60%' }} />
                                    </Form.Item>
                                </div>
                                <div className="">
                                    <Form.Item label="Эхлэх цаг" name="open_time">
                                        <DatePicker format="YYYY-MM-DD HH:mm" />
                                    </Form.Item>
                                </div>

                                <div className="">
                                    <Form.Item label="Дуусах цаг" name="close_time">
                                        <DatePicker format="YYYY-MM-DD HH:mm" />
                                    </Form.Item>
                                </div>
                                {this.state.bannerUrl && 
                                    <Form.Item {...customItemLayout}>
                                        <Image width={200} src={this.state.bannerUrl}/>
                                    </Form.Item>}
                                <UploadBanner bannerImg={this.state.bannerImg} onChange={(ev) => {this.onChange(ev, 'banner')}} onRemove={(ev) => this.onRemove(ev, 'banner')}/>
                                {this.state.buildingUrl && 
                                    <Form.Item {...customItemLayout}>
                                        <Image width={200} src={this.state.buildingUrl}/>
                                    </Form.Item>}
                                <UploadBuilding buildingImg={this.state.buildingImg} onChange={(ev) => {this.onChange(ev, 'building')}} onRemove={(ev) => this.onRemove(ev, 'building')}/>
                                {this.state.locationUrl && 
                                    <Form.Item {...customItemLayout}>
                                        <Image width={200} src={this.state.locationUrl}/>
                                    </Form.Item>}
                                <UploadLocation locationImg={this.state.locationImg} onChange={(ev) => {this.onChange(ev, 'location')}} onRemove={(ev) => this.onRemove(ev, 'location')}/>

                                <Form.Item label="Ноорог" name="is_draft" valuePropName="checked">
                                    <Switch defaultChecked={false}/>
                                </Form.Item>
                                <Form.Item {...customItemLayout}>
                                    <Button type="primary" htmlType="submit" disabled={this.state.finishUpload} loading={this.state.finishUpload}>
                                        Хадгалах
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                        {/* } */}
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // let event_id = (ownProps || {}).eventId || 0
    return {
        // event_id,
    };
};

export default connect(mapStateToProps)(EventEdit);
