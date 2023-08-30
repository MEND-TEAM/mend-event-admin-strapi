import React from 'react';
import {List, Card, Col, Row,  Icon, Avatar, Upload, Modal, Form, Input, Button, message} from 'antd'
import config from '../../config'
import Auth from '../../lib/auth'
import axios from 'axios'
const { Meta } = Card


class ProgramExhibition extends React.Component {
    constructor(props){
        super(props);
        this.state={
            titile: '',
            description: '',
            image: '',
            eventexhibitions: [],
            programId: this.props.programId || '',
            eventId: this.props.eventId || ''
        }
    }

    handleSubmit= event =>{
        event.preventDefault();
        const element = document.getElementById('exhibition-form');
        axios.post(`${config.API_DOMAIN}/eventexhibitions/customCreate`, new FormData(element), {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
        .then(function (response) {
            message.success("Successfully inserted")
            console.log("event-response", response.data);
        })
        .catch(function (error) {
            message.error("Error")
            console.log(error);
        });
    }

    handleTitleChange = e => {
        this.setState({ title: e.target.value });
    };

    handleDescriptionChange = e => {
        this.setState({ description: e.target.value });
    };

    handleImgChange = e => {
        this.setState({ image: e.target.value });
    };

    async componentDidMount(){
        let response= await fetch(`${config.API_DOMAIN}/eventexhibitions/list`);
        if(!response.ok){
            return
        }
        let eventexhibitions = await response.json()
        let selected=[]
        if((eventexhibitions || []).length >0){
            selected= eventexhibitions.filter((eventexhibition)=>{
                return eventexhibition.event_program == this.state.programId
            })
        }
        this.setState({
            ...this.state, 
            eventexhibitions,
            eventexhibition: selected || {}
        })

    }

    render(){
        const {eventexhibition}= this.state
        console.log(eventexhibition)
        return(
            <div>
                <Row gutter={16}>
                    <Col span={12} >
                        <Card title="Зураг нэмэх" bordered={false}>
                            <Form id="exhibition-form" onSubmit={this.handleSubmit}>
                                <Input type="hidden" name="event" value={this.props.eventId}/>
                                <Input type="hidden" name="event_program" value={this.props.programId}/>
                                <Form.Item>
                                    <Input type="text" name="title" placeholder="Зурагны гарчиг оруулна уу" />
                                </Form.Item>
                                <Form.Item>
                                    <Input type="text" name="description" placeholder="Зурагны тайлбар оруулна уу"/>
                                </Form.Item>
                                <Form.Item>
                                    <Input type="file" name="image" placeholder="Зурагаа оруулна уу"/>
                                </Form.Item>
                                <Button htmlType="submit" type="primary"> Save</Button>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Зурагны жагсаалт" bordered={false}>
                            <List 
                                 itemLayout="horizontal"
                                 dataSource={eventexhibition}
                                 pagination={{
                                    onChange: page => {
                                      console.log(page);
                                    },
                                    pageSize: 1,
                                  }}
                                 renderItem={exhibition => (
                                    <List.Item>
                                        <Card
                                            style={{ width: 220 }}
                                            cover={
                                                <img
                                                    alt="example"
                                                    src={`${config.API_DOMAIN}/${exhibition.image}`}
                                                />
                                            }
                                            actions={[
                                                <Icon type="like" key="setting" />,
                                                <Icon type="dislike" key="edit" />
                                            ]}
                                        >
                                            <Meta
                                                title={exhibition.title}
                                            />
                                        </Card>
                                    </List.Item>
                                 )}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default ProgramExhibition;