import React, {Component} from 'react';
import { connect } from 'react-redux';
import { List, Form, Image, Input, InputNumber, Icon, Button, Card, Col, Row, message, Pagination, Upload} from 'antd';
import config from '../../config';
import Api from './api';

const domain = config.API_DOMAIN;
const _limit = 5;

const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
    },
};
const customItemLayout = {
    wrapperCol: {
        xs: { span: 12, offset: 6 },
        sm: { span: 12, offset: 6 },
    },
};
const mimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'] //accepted mime types

const UploadImage = props => {
    const { bannerImg, onChange, onRemove } = props;
    const pprops = {
        onRemove: (file) => {
            onRemove(file)
        },
        beforeUpload: (file) => {
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

class Question extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            eventId: props.eventId || '',
            total: 0,
            page: 1,
            bannerImg: [],
            selected: {},


            eventquestions: [],
            eventquestion: [],
            question: '',
            answer_text: '',
        }
        this.formRef = React.createRef();
    }

    componentDidMount (){
        this.fetchCount()
        this.fetchFaqs({})
    }

    fetchCount = async () => {
        let json = await Api.countFaqs({event: this.state.eventId})
        if((json || json ==0) && !json.code){
            this.setState({total: json})
        } else {
            message.error( json.message || 'Алдаа гарав. getCount faqs');
        }
    }

    fetchFaqs = async({page=1}) => {
        let _start = (page - 1) * _limit;
        
        let params = {_start, _limit, _sort: 'priority:asc,id:desc', event: this.state.eventId }

        let json = await Api.fetchFaqs(params)
        console.log('faqs', json)
        if(json && !json.code){
            this.setState({eventfaqs: json})
        } else {
            message.error( json.message || 'Алдаа гарав. getCount faqs');
        }
    }

    onPageChange = (page) => {
        this.setState({page: page})
        this.fetchFaqs({page: page})
    }

    onSelectFaq = (faq) => {
        this.setState({selected: faq})
        this.formRef.current.setFieldsValue({
            question: faq.question,
            answer: faq.answer_text,
            priority: faq.priority || ''
        })

    }

    newQuestion = () => {
        this.setState({selected: {}})
        this.formRef.current.setFieldsValue({
            question: '',
            answer: ''
        })
        
    }

    removeQuestion = async () => {
        if(this.state.selected.id){
            let json = await Api.removeQuestion({id: this.state.selected.id})
            console.log('remove', json)
            if(json && !json.code){
                this.setState({page: 1})
                this.fetchCount()
                this.fetchFaqs({page: 1})
            } else {
                message.error( json.message || 'Алдаа гарав. remove faqs');
            }
        }
    }

    handleSubmit = async (values) => {
        const {selected, bannerImg} = this.state
        if(values.question != selected.question || values.answer != selected.answer_text || bannerImg.length > 0 || values.priority != selected.priority){
            const formData = new FormData();
            let params = {
                question: values.question,
                answer_text: values.answer,
                priority: values.priority
            }
            for (const name in params) {
                formData.append(name, params[name]);
            }
            if(this.state.bannerImg.length > 0){
                formData.append('answer_image', this.state.bannerImg[0])
            }
            console.log('params', params)
            let json = ''
            if(selected.id) { // update speaker
                formData.append('id',selected.id)
                json = await Api.updateFaq(formData)
            } else { //create new speaker
                formData.append('event',this.state.eventId)
                json = await Api.createFaq(formData);
            }
            console.log('handle', json)
            if (json && json.result) {
                this.setState({page: 1})
                this.fetchCount()
                this.fetchFaqs({page: 1})
            } else {
                message.error( json.message || 'Алдаа гарав. create or update faqs');
            }
        }


        // const data={
        //     question: this.state.question,
        //     answer_text: this.state.answer_text,
        //     event: this.state.eventId
        // }
        // console.log("data", data)
        // fetch(`${config.API_DOMAIN}/eventfaqs`, {
        //     method: 'POST',
        //     headers: new Headers({
        //         'Content-Type': 'application/json'
        //     }),
        //     body: JSON.stringify(data),
        // })
        // .then((res) => res.json()
        //     ,message.success("Successfully inserted")) 
        // .catch((err)=>console.log(err), message.error("Error"))
    };





    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue("keys");
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k)
        });
      };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue("keys");
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys
        });
    };



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

    handleAnswerChange = event=>{
        this.setState({...this.state, answer_text: event.target.value})
    }

    handleQuestionChange = event=>{
        this.setState({...this.state, question: event.target.value})
    }

    render(){
        const {eventfaqs, eventId, page, total, selected = {}} =this.state;
        return (
            
            <div style={{  marginRight: '60px' }}>
            {/* <h1>{this.props.eventId}</h1> */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Асуултнууд" bordered={false}>
                        <List
                            itemLayout="horizontal"
                            pagination={false}
                            dataSource={eventfaqs}
                            renderItem={faq => (
                              <List.Item onClick={()=>{ this.onSelectFaq(faq) }} style={{backgroundColor : faq.id == selected.id ? '#1890ff' : '', color : faq.id == selected.id ? 'white' : 'black'}}>
                                <Col gutter={8}>
                                    <Row gutter={8}>
                                        <Col><b>{faq.priority || ''}</b></Col>
                                        <Col><b>{faq.question}</b></Col>
                                         
                                    </Row>
                                    { (faq.answer_image || {}).url != '' ?
                                        <Row gutter={8}>
                                            <Col span={4}><Image width={'100%'} src={domain + faq.answer_image.url}/></Col>
                                            <Col span={20}>{faq.answer_text}</Col>
                                        </Row>
                                        : <Col >{faq.answer_text}</Col>
                                    }
                                </Col>
                              </List.Item>
                            )}
                        />
                        <Pagination defaultPageSize={_limit} current={page} total={total} style={{marginTop: '30px'}}
                            showTotal={(total) => <span>Нийт: {total}</span>} onChange={this.onPageChange} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Асуулт нэмэх" bordered={false}>
                            <div className="addQuestion">
                                
                                <Form ref={this.formRef} onFinish={this.handleSubmit} {...formItemLayout}>
                                    <Form.Item label="Дараалал" name="priority">
                                        <InputNumber />
                                    </Form.Item>
                                    <Form.Item label="Асуулт" name="question">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Хариулт" name="answer">
                                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 8 }} />
                                    </Form.Item>
                                    <UploadImage bannerImg={this.state.bannerImg} onChange={(ev) => {this.onChange(ev)}} onRemove={(ev) => this.onRemove(ev)}/>
                                    <Form.Item {...customItemLayout}>
                                        <div>
                                            {this.state.selected.id && <Button style={{marginRight: '30px'}} type="primary" onClick={this.newQuestion}>Шинээр нэмэх</Button>}
                                            <Button type="primary" htmlType="submit">Хадгалах</Button>
                                            {this.state.selected.id && <Button style={{marginLeft: '30px'}}  onClick={this.removeQuestion}>Устгах</Button>}
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                </Row>
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
// const Wrappedeventquestion = Form.create({ name: 'dynamic_form_item' })(Question);
export default connect(mapStateToProps)(Question);