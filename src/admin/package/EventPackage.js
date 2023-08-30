import React from 'react';
import moment from 'moment';
import { Button, Card, Col, Row, List, message, Popconfirm, Modal, Table, Pagination} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';

import CreatePackage from './CreatePackage'
import Api from './api'

const _limit = 10;
const columns = [
    {
        title: 'Цаг',
        dataIndex: 'open_time',
    },
    {
        title: 'Өрөө',
        dataIndex: 'roomName',
    },
    {
        title: 'Хөтөлбөрийн нэр',
        dataIndex: 'title',
    },
]
class EventPackage extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            eventId: props.eventId || '',
            eventpackages: [],
            total: 0,
            page: 1,
            filter: '',
            roomList: [],
            programList: [],
            selectedRowKeys: [],
            selectedPackageId: 0,
            showPackageModal: false,
            saveButtonDisable: true,
            isSaving: false,

        }
    }

    async componentDidMount(){
        this.fetchRoomsEvent()
        this.fetchPackages()
        this.fetchProgramsCount({filter: ''})

    }

    fetchRoomsEvent = async () => {
        let json = await Api.fetchRoomsEvent({ event: this.state.eventId });
        if (json && !json.code) {
            this.setState({ roomList: json });
            this.fetchProgramsByEvent({ page: 1, filter: '' });
        } else {
            message.warning(
                <div>
                    Өрөөний мэдээлэл олдсонгүй.
                    <br />
                    {json.message || ''}
                </div>
            );
        }
    };

    fetchPackages = async () => {
        let json = await Api.fetchPackages({event: this.state.eventId})
        if(json && !json.code){
            this.setState({eventpackages: json})
        } else {
            message.error( json.message || 'Алдаа гарав. fetch packages');
        }
    }

    fetchProgramsCount = async ({filter = ''}) => {
        let json = await Api.fetchProgramsCount({ event: this.state.eventId, filter });

        if ((json || json == 0) && !json.code) {
            this.setState({ total: json });
        } else {
            message.error( json.message || 'Алдаа гарав. get programs count');
        }
    }

    fetchProgramsByEvent = async ({ page = 1, filter = '' }) => {
        let _start = (page - 1) * _limit;
        let json = await Api.fetchProgramsByEvent({ event: this.state.eventId, _limit, _start, _sort: 'open_time:asc', filter })
        if (json && !json.code) {
            json.map((p) => {
                let roomName = this.state.roomList.find(el => {return el.id == p.eventroom});
                p.key = p.id
                p.roomName = (roomName || {}).room_number || '';
                p.open_time = moment.utc(p.open_time).format('HH:mm MM/DD');
                if(p.program_type == "undefined") {
                    p.program_type = ''
                }
            });

            this.setState({ programList: json });
        } else {
            message.error( json.message || 'Алдаа гарав. get programs');
        }
    }

    createPackage = () =>{
        this.setState({ showPackageModal: true })
    }

    removePackage = async (pack) => {
        let json = await Api.removePackage({id: pack.id})
        if(json && !json.code){
            this.setState({ selectedPackageId: 0, selectedRowKeys: [] })
            this.fetchPackages()
        } else {
            message.error( json.message || 'Алдаа гарав. remove package');
        }
    }

    successPackage = () => {
        this.setState({showPackageModal: false, selectedRowKeys: []})
        this.fetchPackages()
    }

    createPackageModal = () =>{
        return (
            <Modal
                title="Багц үүсгэх"
                className="add-package-modal"
                header={null}
                visible={true}
                footer={null}
                onCancel= { ()=>{
                    this.setState({showPackageModal: false})
                }}>
                <CreatePackage eventId={this.state.eventId} onSuccess={this.successPackage}/>
            </Modal>
        )
    }

    selectPackage = async(packageId) =>{
        this.setState({selectedPackageId: packageId})
        let json = await Api.fetchProgramsByPackage({event_package: packageId})
        if(json && !json.code){
            this.setState({selectedRowKeys: json})
        } else {
            message.error( json.message || 'Алдаа гарав. updage package-programs');
        }
    }

    onPageChange = (page) => {
        if (this.state.page !== page) {
            this.setState({ page: page});
            this.fetchProgramsByEvent({ page });
        }
    }

    savePackagePrograms = async () => {
        this.setState({isSaving: true})
        const {selectedPackageId, selectedRowKeys, eventId} = this.state
        let json = await Api.savePackagePrograms({id: selectedPackageId, programs: selectedRowKeys, event: eventId})
        if(json && !json.code && json.result){
            message.info( 'Амжилттай хадгалав');
            this.setState({saveButtonDisable: true, isSaving: false})
        } else {
            message.error( json.message || 'Алдаа гарав. add programs to package');
            this.setState({isSaving: false})
        }
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys, saveButtonDisable: false});
    };

    render(){
        
        const {selectedPackageId,showPackageModal, page, total,saveButtonDisable,isSaving, eventpackages, programList, selectedRowKeys}=this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            preserveSelectedRowKeys: true
        };
         return(
            <div style={{ marginRight: '60px' }}>
                <Row gutter={16} style={{marginTop: "10px"}}>
                    <Col span={6}>
                        <Card title="Багцууд" bordered={false}>
                        <Button type="primary" onClick={this.createPackage} style={{marginBottom: '10px'}}>Багц үүсгэх</Button>
                            <List
                                itemLayout="horizontal"
                                dataSource={eventpackages}
                                pagination={{
                                    onChange: page => {
                                    },
                                    pageSize: 10,
                                }}
                                renderItem={item => (
                                    <List.Item key={item.id} style={{backgroundColor: selectedPackageId == item.id ? '#1890ff' : '', padding: '0 20px'}}>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={item.amount}
                                            onClick = { ()=>{this.selectPackage(item.id)} }
                                        />
                                        <Popconfirm
                                                title="Оролцогчийг устгах уу?"
                                                onConfirm={() => {
                                                    this.removePackage(item);
                                                }}
                                                okText="Тийм"
                                                cancelText="Үгүй">
                                                <DeleteOutlined style={{color: selectedPackageId == item.id ? 'white' : '#1890ff'}}/>
                                            </Popconfirm>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card title="Хөтөлбөрүүд" bordered={false} extra={<Button loading={isSaving} disabled={saveButtonDisable || selectedPackageId == 0} type="primary" onClick={this.savePackagePrograms} style={{marginRight: '20px'}}>Хадгалах</Button>}>
                            <Table
                                rowSelection = {rowSelection}
                                columns={columns} 
                                dataSource={programList}
                                pagination={false}
                                size="small" />
                            <Pagination
                                style={{marginTop: '30px'}}
                                defaultPageSize={_limit}
                                current={page}
                                total={total}
                                showTotal={(total) => <span>Нийт: {total}</span>}
                                onChange={this.onPageChange}
                            />
                        </Card>
                    </Col>
                </Row>
                {showPackageModal && this.createPackageModal()}
            </div>
         )
     }
 }
 export default EventPackage;