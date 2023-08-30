import React from 'react';
import { Input, Form, Button, Card, Col, Row, Table, Select, Checkbox, message } from 'antd';
import Api from './api';


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

class CreatePackage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            eventId : props.eventId || '',

            name: '',
            amount: '',
            event: '',
            programList: [],
        }
        this.formRef = React.createRef()
    }

    async componentDidMount(){

        // let programList =[]
        // let response = await axios.get(`${config.API_DOMAIN}/eventprograms/list?event=${this.state.eventId}`)
        // programList = response.data
        // let temp = {};
        // programList.map(program => {
        //     temp[program.id] = program;
        // });

        // this.setState({ 
        //     programList: temp,
        //     filterProgram: programList,
        // })
    }

    handleNameChange = event => {
        this.setState({ ...this.state, name: event.target.value });
    }

    handleAmountChange = event =>{
        this.setState({...this.state, amount: event.target.value})
    }

    handleSubmit = async (values) =>{
        let params = {
            name: values.name,
            amount: values.amount,
            event: this.state.eventId 
        }

        let json = await Api.createPackage(params)
        console.log('createPackage', json)
        if(json && !json.code){
            this.props.onSuccess()
        } else {
            message.error( json.message || 'Алдаа гарав. create package');
        }
    }

    render(){
        return(
            <div className="event-list">
                <Form ref={this.formRef} onFinish={this.handleSubmit} {...formItemLayout}>
                    <Form.Item  label="Багцын нэр" name="name">
                        <Input style={{ width: "80%" }}/>
                    </Form.Item>
                        <Form.Item label="Үнийн дүн" name="amount">
                            <Input style={{ width: "80%" }}/>
                        </Form.Item>
            
                    <Form.Item {...customItemLayout}>
                        <Button htmlType="submit" type="primary" style={{width: "40%"}}>Хадгалах</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default CreatePackage;