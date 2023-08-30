import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Icon, Button, Card, Row, List, Col, message, Modal, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, UnorderedListOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios'
import Auth from '../../lib/auth'
import { fileToObject } from 'antd/lib/upload/utils';
import Api from './api';

let id = 0;

class ProgramPoll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: props.eventId || '',
            programId: props.programId || '',
            eventpolls: [],
            is_create: false,
            answerList: {},
            id: 0,
            showModal: false,
            selectedPoll: {},
            polloptions: [],
        }
        this.formRef = React.createRef()
    }

    componentDidMount (){
        this.fetchPolls()
    }

    fetchPolls = async()=>{
        let json = await Api.fetchPolls({eventprogram: this.state.programId})
        if(json && !json.code){
            let polls = json || []
            // if(polls.length > 0){
            //     let queries = polls.map((p)=>{return (`event_poll_in=` + p.id)})
            //     let optionJson = await Api.fetchPollOptions({query: queries.join('&')})
            //     if(optionJson && !optionJson.code) {

            //     } else {
            //         message.error(
            //             <div>
            //                 Алдаа гарав.
            //                 <br />
            //                 {json.message || 'fetchPollOptions'}
            //             </div>
            //         );
            //     }
            // }
            this.setState({eventpolls: polls})
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'fetchPolls'}
                </div>
            );
        }

        // let response = await fetch(`${config.API_DOMAIN}/eventpolls/list?eventprogram=${this.props.programId}`);
        // if(response.ok){
        //     const eventpolls= await response.json();
        //     console.log("event polls", eventpolls);
        //     let selected=[]
        //     if((eventpolls || []).length >0){
        //         selected = eventpolls.filter(async(eventpoll)=>{
        //             let response= await fetch(`${config.API_DOMAIN}/eventpolloptions/list?event_poll=${eventpoll.id}`)
        //             let polloptions = await response.json();
        //             console.log("poll options", polloptions)
        //             return polloptions
        //         })
        //         console.log("poll selected", selected);
        //     }
        //     this.setState({
        //         ...this.state,
        //         polloption: selected || {}, 
        //         eventpolls
        //     })
            
        // }
        
   }


    remove = index => {
        let { answerList } = this.state;
        delete answerList[index];
        this.setState({ ...this.state, answerList });
    };

    add = () => {
        let { answerList, id } = this.state;
        id++;
        answerList[id] = {};
        answerList[id].option = String.fromCharCode(64 + Object.keys(answerList).length);
        answerList[id].question = '';
        this.setState({ answerList, is_create: true, id });
    };

    onChange = (event, key) => {    
        let { answerList } = this.state;
        if (answerList[key]) {
            answerList[key].answer = event.target.value;
            this.setState({ answerList });
        }
    }

    onCreatePoll = async (values) => {
        const { eventId, programId, answerList } = this.state;
        const data = {
            event: eventId,
            eventprogram: programId,
            question: values.question,
            optionList: answerList
        };

        let json = await Api.createPoll(data)
        if(json && !json.code){
            message.success("Амжилттай үүсгэв.");
            this.fetchPolls()
            this.setState({is_create: false, answerList : {}, id: 0})
            this.formRef.current.setFieldsValue({
                question: ''
            })
        } else {
            message.warning(
                <div>
                    Санал асуулга үүсгэхэд алдаа гарав.
                    <br />
                    {json.message || 'createPoll'}
                </div>
            );
        }
    }

    editPoll = async (poll) => {
            let optionJson = await Api.fetchPollOptions({event_poll: poll.id})
            console.log('polloptions', optionJson)
            if(optionJson && !optionJson.code) {
                this.setState({showModal: true, selectedPoll: poll, polloptions: optionJson})
            } else {
                message.error(
                    <div>
                        Алдаа гарав.
                        <br />
                        {json.message || 'fetchPollOptions'}
                    </div>
                );
            }
        
    }

    pollModal = () => {
        
        return (<Modal
            title={this.state.selectedPoll.question}
            className="program-modal"
            width="40%"
            header={null}
            visible={true}
            footer={null}
            onCancel={() => {
                this.setState({ showModal: false });
            }}>
            <div>
                
                {this.state.polloptions.length > 0 ? this.state.polloptions.map((po)=>{
                    return (<div key={po.id}>
                        <span>{po.option_name}</span>: {po.description}
                    </div>) 
                }): <div>Хариулт хоосон байна.<br/>Устгаад дахиад үүсгэ.</div>}
            </div>
        </Modal>);
    }

    removePoll = async (poll) => {
        let json = await Api.deletePoll({id: poll.id})
        if(json && !json.code && json.result) {
            this.fetchPolls();
            message.success(<div><span>{poll.name}</span> санал асуулга устав.</div>)
        }
    }

    render() { 
        const {eventpolls, polloption, is_create} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };

        const customItemLayout = {
            wrapperCol: {
                xs: { span: 12, offset: 6 },
                sm: { span: 12, offset: 6 },
            },
        }

        const { answerList } = this.state;
        const formItems = Object.keys(answerList).map((key, index) => {
            return (
                <Form.Item
                    label={answerList[key].option}
                    required={false}
                >
                    <Input placeholder="Хариулт" onChange={(event) => { this.onChange(event, key); }} style={{ width: '60%', marginRight: 8 }} />

                    <DeleteOutlined onClick={() => this.remove(key)} />

                </Form.Item>
            );
        });
        return (
            <div style={{ background: '#ECECEC', padding: '10px', marginRight: '60px' }}>
                <Row gutter={16}>
                    <Col span={12} >
                        <Card title="Санал асуулга" bordered={false}>
                            <div className="addQuestion">
                                <Form ref={this.formRef} onFinish={this.onCreatePoll} {...formItemLayout}>
                                    <Form.Item label="Санал асуулга" name="question" rules={[{ required: true, message: 'Асуултаа оруулна уу.' }]}>
                                        <Input.TextArea rows={2} />
                                    </Form.Item>
                                    <Form.Item label="Хариултууд" />
                                    {is_create && formItems}
                                    <Form.Item {...customItemLayout} >
                                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }} icon={<PlusOutlined />}/>
                                    </Form.Item>

                                    <Form.Item {...customItemLayout}>
                                        <Button type="primary" htmlType="submit">Үүсгэх</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Санал асуулгууд " bordered={false}>
                            <List
                                itemLayout="horizontal"
                                dataSource={eventpolls}
                                pagination={{
                                    onChange: page=>{
                                        console.log(page);
                                    },
                                    pageSize: 6,
                                }}
                                renderItem={ poll=>(
                                    <List.Item>
                                        <List.Item.Meta
                                            title={poll.question}
                                        />
                                        <UnorderedListOutlined style={{ color: '#1890ff', marginRight: '20px' }} onClick={() =>{this.editPoll(poll)}}/>
                                        <Popconfirm
                                            title="Устгах уу?"
                                            onConfirm={() => {
                                                this.removePoll(poll);
                                            }}
                                            okText="Тийм"
                                            cancelText="Үгүй">
                                            <DeleteOutlined style={{ color: '#1890ff' }} />
                                        </Popconfirm>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                {this.state.showModal && this.pollModal()}
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
// const WrappedProgrampoll = Form.create({ name: 'dynamic_form_item' })(ProgramPoll);
export default connect(mapStateToProps)(ProgramPoll);