import {
    Button,
    Col,
    Icon,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import config from '../../config';
import Auth from '../../lib/auth';
import Api from './api';
import PaymentAdd from './PaymentAdd';

const { Option } = Select;

const _limit = 10
const columns = [
    {
        title: 'Утас',
        dataIndex: 'phone',
    },
    {
        title: 'Нэр',
        dataIndex: 'firstname',
    },
    // {
    //     title: 'Регистер',
    //     dataIndex: 'register_number',
    //     // ...this.getColumnSearchProps('register_number')
    // },
    {
        title: 'Нэхэмжлэх',
        dataIndex: 'invoice_number',
    },
    {
        title: 'Төлбөрийн хэлбэр',
        dataIndex: 'payment_type',
    },
    {
        title: 'Мөнгөн дүн',
        dataIndex: 'amount',
    },
    {
        title: 'Төлсөн эсэх',
        dataIndex: 'isPaid',
    },
    {
        title: 'Эвент',
        dataIndex: 'eventName',
        width: '30%',
    },
    {
        title: 'Огноо',
        dataIndex: 'created_at'
    }
];

class PaymentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            invoiceList: [],
            selectedEventId: 0,
            search: '',
            page: 1,
            total: 0,
            filter: 'all',
            selectedRowKeys: [],
            selectedInvoice: {},
            choosePaymentType: false,


            paymentList: [],
            modal: false,
            eventFilter: [],
            paymentFilter: [],
            selectedKeys: [],
            disabled: true,
            selectedEvent: '',
            eventList: []
        };

        if (sessionStorage.getItem('paymentEventId')) {
            this.state.selectedEvent = sessionStorage.getItem('paymentEventId');
        }
    }

    componentDidMount() {
        // const eventList = await axios
        //     .get(`${config.API_DOMAIN}/events/list`, {
        //         headers: {
        //             Authorization: 'Bearer ' + Auth.getToken()
        //         }
        //     })
        //     .then(function(response) {
        //         if (response.status == 200) {
        //             const list = response.data;
        //             list.map(item => {
        //                 return {
        //                     id: item.id,
        //                     name: item.name
        //                 };
        //             });
        //             return Promise.resolve(response.data);
        //         }
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //         return Promise.resolve([]);
        //     });
        // this.setState({ eventList });
        // this.updatePayment();
        this.fetchInvoiceCount({})
        this.fetchInvoices({})
    }
    
    fetchEvents = async (search = '') =>{
        let params = {_sort: 'id:desc', is_draft: 'false', _limit: 50} //hailtiin ehnii 50 utgiig
        if(search){
            params = {...params, name_contains: search}
        }
        let json = await Api.fetchEventList(params)
        // console.log('fetchEvents', json)
        if (json.code == 1000) {
            let events = json.list.map((e)=>{return {id: e.id, name: e.name}})
            this.setState({ loading: false, events: events });
            
        } else {
            message.error(
                <div>
                    Алдаа гарав.
                    <br />
                    {json.message || 'Алдаа гарав. fetchEvents'}
                </div>
            );
        }
    }

    fetchInvoiceCount = async ({event = 0, search = '', filter = 'all'})=>{
        let json = await Api.countInvoiceList({event, search, filter})
        console.log('count', json)
        if(json && !json.code){
            this.setState({total: json[0].cnt})
        } else {
            message.error(json.message || 'Алдаа гарав. fetchInvoiceCount');
        }
    } 

    fetchInvoices = async ({event = 0, page = 1, search = '', filter = 'all'}) =>{
        let json = await Api.fetchInvoiceList({event, page, max: _limit, search, filter})
        console.log('fetchMembers', json)
        if(json && !json.code && json.result){
            let list = json.data.map((i)=> {
                let isPaid = (i.payment_type) ? 'Төлсөн' : 'Үгүй'
                let created_at = (i.payment_type) ? i.payment_created : i.invoice_created
                created_at = moment(created_at).format('YYYY-MM-DD HH:mm')
                return {...i, isPaid, created_at, key: i.invoiceId}
            })

            this.setState({invoiceList : list})
        } else {
            message.error(json.message || 'Алдаа гарав. fetchInvoices');
        }

    }

    onSearchEvent = (value) => {
        this.fetchEvents(value)
    }
    onFocus = () => {
        this.fetchEvents('')
    }

    eventOnChange = value => {
        this.setState({selectedEvent: value, page: 1})
        this.fetchInvoiceCount({event: value, search: this.state.search, filter: this.state.filter })
        this.fetchInvoices({event: value, search: this.state.search, page: 1, filter: this.state.filter })
    };

    searchBy = (value) => {
        console.log('searchBy', value)
        this.setState({search: value, page: 1})
        this.fetchInvoiceCount({event: this.state.selectedEvent, search: value, filter: this.state.filter })
        this.fetchInvoices({search: value, event: this.state.selectedEvent, page: 1, filter: this.state.filter })
    }

    onPageChange =(page) => {
        this.setState({page})
        this.fetchInvoices({page, search: this.state.search, 
            event: this.state.selectedEvent, filter: this.state.filter })
    }

    onToggle = (checked) => {
        let filter = checked ? 'paid' : 'all'
        this.setState({filter})
        this.fetchInvoiceCount({event: this.state.selectedEvent, search: this.state.search, filter})
        this.fetchInvoices({event: this.state.selectedEvent, search: this.state.search, filter, page: 1})
    }

    selectInvoice = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRows[0])
        
        this.setState({
            selectedInvoice: selectedRows[0],
            selectedRowKeys,
            disabled: false
        });
    };

    cancelInvoice = async () => {
        console.log('selectedInvoice', this.state.selectedInvoice)
        const {selectedInvoice} = this.state
        let json = ''
        if(selectedInvoice.pid) {
            json = await Api.cancelPayment({id: selectedInvoice.pid, status: 'D'})
        } else {
            json = await Api.removeInvoice({id: selectedInvoice.invoiceId})
        }

        if(json && !json.code){
            this.fetchInvoiceCount({event: this.state.selectedEvent, search: this.state.search, filter: this.state.filter})
            this.fetchInvoices({event: this.state.selectedEvent, search: this.state.search, filter: this.state.filter, page: 1})
        } else {
            message.error(json.message || 'Алдаа гарав. cancel or remove Invoice');
        }
        
    };

    showModal = () => {
        this.setState({ modal: true });
    };

    paymentModal = () => {
        if (this.state.modal) {
            return (
                <Modal
                    title="Төлбөр баталгаажуулах"
                    className="program-modal"
                    width="70%"
                    header={null}
                    visible={true}
                    footer={null}
                    onCancel={this.onSuccessPayment}>
                    <PaymentAdd 
                        eventId={this.state.selectedEvent} 
                        onSearchEvent={this.onSearchEvent} 
                        events={this.state.events} 
                        onFocus={this.onFocus}
                        onSuccess={this.onSuccessPayment}/>
                </Modal>
            );
        }
    };

    onSuccessPayment = () => {
        this.setState({modal: false})
        
    }

    

    editInvoice = async () => {
        this.setState({choosePaymentType: true})
        
    }

    cancel = () => {
        this.setState({choosePaymentType: false})
    }
    onFinish = () => {
        this.setState({choosePaymentType: false, selectedInvoice: {...this.state.selectedInvoice, isPaid: 'Төлсөн'}})
        this.fetchInvoices({event: this.state.selectedEvent, search: this.state.search, filter: this.state.filter, page: 1})
    }
    
    render() {
        const {invoiceList, total, page, selectedRowKeys, selectedInvoice, choosePaymentType} = this.state
        const {isPaid = '', invoiceId = ''} = selectedInvoice
        return (
                <Space direction="vertical" style={{ padding: '20px 50px 20px 70px', width: '100%' }}>
                    <Row justify="space-between">
                        <Col span={11}>
                            <Input.Search placeholder="Утасны дугаар" onSearch={this.searchBy} style={{width: '200px'}}/>
                            <Button
                                type="primary"
                                onClick={this.showModal}
                                style={{ marginLeft: '20px' }}>
                                Төлбөр бүртгэх
                            </Button>
                            {(invoiceId && isPaid == 'Үгүй') && <Popconfirm
                                title={"Сонгосон нэхэмжлэхийг төлснөөр бүртгэх үү?"}
                                type="danger"
                                onConfirm={this.editInvoice}
                                okText="Тийм"
                                cancelText="Үгүй"
                                icon={<EditOutlined />}
                                >
                                <Button
                                    type="primary"
                                    style={{ marginLeft: '20px' }}>
                                    Төлөх
                                </Button>
                            </Popconfirm>}
                            {invoiceId && <Popconfirm
                                title={isPaid == 'Төлсөн' ? "Сонгосон төлбөрийг цуцлах уу?" : "Устгах уу?"}
                                type="danger"
                                onConfirm={this.cancelInvoice}
                                okText="Тийм"
                                cancelText="Үгүй"
                                icon={<DeleteOutlined />}
                                >
                                <Button
                                    type="danger"
                                    style={{ marginLeft: '20px' }}>
                                    {isPaid == 'Төлсөн' ? 'Цуцлах' : 'Устгах'}
                                </Button>
                            </Popconfirm>}
                        </Col>
                        <Col span={2}>
                            <Switch checkedChildren="Төлсөн" unCheckedChildren="Бүгд" defaultChecked={false} onChange={this.onToggle}/>
                        </Col>
                        <Col span={11}>
                            <Select
                                placeholder="Эвэнт хайх"
                                style={{ width: '300px' }}
                                showSearch
                                allowClear
                                onSearch={this.onSearchEvent}
                                optionFilterProp="children"
                                onChange={this.eventOnChange}
                                onFocus={this.onFocus}
                                >
                                {this.state.events.map(item => {
                                    return (
                                        <Option key={item.id} id={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <Table
                        style={{ backgroundColor: 'white', width: '90%' }}
                        columns={columns}
                        dataSource={invoiceList}
                        pagination={false}
                        rowSelection={{
                            type: 'radio',
                            onChange: this.selectInvoice,
                            selectedRowKeys: selectedRowKeys
                        }}></Table>
                    <Pagination 
                        defaultPageSize={_limit}
                        current={page}
                        total={total}
                        showTotal={(total) => <span>Нийт: {total}</span>}
                        onChange={this.onPageChange}/>
                    {this.paymentModal()}
                    {choosePaymentType && (<ChoosePaymentType cancel={this.cancel} invoiceId={this.state.selectedInvoice.invoiceId} onFinish={this.onFinish}/>)}
                </Space>
        );
    }
}

const ChoosePaymentType = props => {
    const [paymentType, updatePaymentType] = useState(false);
    const [options, updateOptions] = useState([])
    
    useEffect(() => {
        fetchPaymentTypes();
    }, []);

    const fetchPaymentTypes = async () => {
        console.log('choosePayamnet')
        let json = await Api.fetchPaymentTypes()
        if(json && !json.code){
            updateOptions(json);
            updatePaymentType(json[0])
        } else {
            message.error( json.message || 'Алдаа гарав. fetchPaymentTypes' );
        }
    }
    
    const save = async () => {
        let json = await Api.addPayment({invoiceId: props.invoiceId, paymentType})
        
        if(json && !json.code){
            props.onFinish()
        } else {
            message.error(json.message || 'Алдаа гарав. edit Invoice');
        }
    }

    return (<Modal
        title="Төлбөрийн хэлбэр сонгоно уу"
        width="40%"
        header={null}
        visible={true}
        footer={null}
        onCancel={props.cancel}>
            <Row>
                <Col span={12}>
                    <Select value={paymentType} onSelect={updatePaymentType} style={{ width: '300px' }} >
                        {options.map((op)=> {
                            return <Option key={op} value={op}>{op}</Option>
                        })}
                    </Select>
                </Col>
                <Col>
                    <Button type="primary" onClick={save}>Хадгалах</Button>
                </Col>
            </Row>
    </Modal>);
};

export default PaymentList;
