
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SelectEvent from '../comps/events/SelectEvent';
import {Table, message, Row, Col} from 'antd'
import Api from './api';
import { numberWithCommas } from '../lib/util';
import moment from 'moment'
import {SettingOutlined} from '@ant-design/icons';


const programColumns = [
    {
        title: 'Цаг',
        dataIndex: 'open_time',
        render: (text, row, index) => {
            return <div>{moment(text).isValid() ? moment(text).format('HH:mm MM/DD') : ''}</div>
        }
    },    
    {
        title: 'Нэр',
        dataIndex: 'title'     
    }
]

const packageColumns = (props) => {
    return [
        {
            title: '№',        
            render: (text, row, index) => {
                return <div>{index + 1}</div>
            }
        },
        {
            title: 'Нэр',
            dataIndex: 'name'     
        },
        {
            title: 'Үнэ',
            dataIndex: 'amount',
            render: (text, row, index) => {
                return <div>{numberWithCommas(text)}₮</div>
            }
        },
        {
            title: 'Тайлбар',
            dataIndex: 'description'     
        },
        // {
        //     title: 'Огноо',
        //     dataIndex: 'created_at',
        //     render: (text, row, index) => {
        //         return <div>{moment(text).isValid() ? moment(text).format('YYYY.MM.DD') : ''}</div>
        //     }

        // },
        // {
        //     title: 'Үйлдэл',            
        //     render: (text, row, index) => {
        //         return <div>
        //             <SettingOutlined onClick={(ev) => props.onClick(row)}/>
        //         </div>
        //     }

        // },
    ]
}
const PackageProgram = props => {
    const [fetch, updateFetch] = useState(false)
    const [list, updateList] = useState([])

    useEffect(() => {
        if (props.packageId) {
            fetchEventPackageProgram()
        } else {
            updateList([])
        }
    }, [props.packageId])

    const fetchEventPackageProgram = async() => {
        updateFetch(true)

        let json = await Api.fetchEventPackageProgram({packageId: props.packageId})

        if (json && !json.code) {
            updateList(json)
            updateFetch(false)
        } else {
            updateList([])
            updateFetch(false)
            message.error(<div>Жагсаалт дуудахад алдаа гарав!<div>{json.message}</div></div>)
        }
    }

    return (
        <div >
            {
                (!fetch && (list || []).length > 0) &&
                <Table                    
                    columns={programColumns}
                    rowKey={one => one.id}
                    dataSource={list}                
                    loading={fetch}    
                    pagination={false}            
                />           
            }
        </div>
    )
}

const PackageList = props => {
    const [fetch, updateFetch] = useState(false)
    const [list, updateList] = useState([])

    useEffect(() => {
        if (props.eventId) {
            fetchEventPackageList()
        } else {
            updateList([])
        }
        updateSelected(null)
    }, [props.eventId])

    const fetchEventPackageList = async() => {
        updateFetch(true)

        let json = await Api.fetchEventPackageList({eventId: props.eventId})

        if (json && !json.code) {
            updateList(json)
            updateFetch(false)
        } else {
            updateList([])
            updateFetch(false)
            message.error(<div>Жагсаалт дуудахад алдаа гарав!<div>{json.message}</div></div>)
        }
    }

    const [selected, updateSelected] = useState(null)
    const showProgram = (one) => {
        console.log('showProgram', one)
        updateSelected(one)
    }

    const close = () => {
        updateSelected(null)
    }

    return (
        <div style={{marginTop:'20px'}}>
            <Row gutter={16}>
                <Col span={12}>
                    <Table                        
                        onRow={(one, index) => {
                            return {
                                onClick: (ev) => {
                                    updateSelected(one)
                                }                                
                            }
                        }}
                        rowClassName = {(record) => {
                            return (selected && record.id === selected.id) ? 'selectedRow' : '';
                        }}
                        columns={packageColumns({onClick: showProgram})}
                        rowKey={one => one.id}
                        dataSource={list}                
                        loading={fetch}    
                        pagination={false}            
                    />

                </Col>
                <Col span={12}>
                    {
                        selected &&
                        <PackageProgram packageId={selected.id} onClose={close}/>
                    }
                </Col>
            </Row>
        </div>
    )
}

const EventPackage = props => {

    return(
        <div style={{ padding: '20px' }} className="event-list">
            <h3>Эвэнт пакеж</h3>
            <SelectEvent/>
            {
                props.selectedEvent ?
                <PackageList eventId={props.selectedEvent}/>
                :
                <div
                    style={{
                        padding: '30px 20px 20px 70px',
                        fontSize: '18px'
                    }}>
                    Эвэнт сонгоно уу
                </div>
            }
        </div>
    )
}

const store = (state, ownProps) => {
    

    return {
        selectedEvent: state.app.selectedEvent,       
        eventList: state.app.eventList       
    };
};

export default connect(store)(EventPackage);
