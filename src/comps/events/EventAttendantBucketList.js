import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Popconfirm, Row, Table } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import Api from './api';
const { Search } = Input;
import {withSocket} from '../hooks/socket'
const userColumn = [
    {
        title: 'Нэр',
        dataIndex: 'firstname'
    },
    {
        title: 'Овог',
        dataIndex: 'lastname'
    },
    {
        title: 'Ирцийн цаг',
        dataIndex: 'created_at',
        render: (text, record, index) => {
            return (
                <div>
                    {moment(record.created_at).isValid()
                        ? moment(record.created_at).format('HH:mm MM/DD')
                        : ''}
                </div>
            );
        }
    }
    // {
    //     title: 'Регистрийн дугаар',
    //     dataIndex: 'register_number'
    // },
    // {
    //     title: 'Утас',
    //     dataIndex: 'phone'
    // },
    // {
    //     title: 'Ирц өгсөн',
    //     dataIndex: 'attend',
    //     render: (text, record, index) => {
    //         return <div>{(record.attend || 0) > 0 ? 'Тийм' : ''}</div>;
    //     }
    // }
];

export const BucketUser = withSocket(props => {
    const [fetch, updateFetch] = useState(false);
    const [list, updateList] = useState([]);
    const [total, updateTotal] = useState(0);
    const prev = useRef(null)
    
    useEffect(() => {
        if (props._connected) {//socket connected
            props._subscribe('bucket', (data) => {
                console.log('bucket data', data)
                fetchBucketUser();
            })

            if (prev.current != props.bucketId) {
                props._join(`bucket_${props.bucketId}`)
                if (prev.current) {
                    props._leave(`bucket_${prev.current}`)
                }
                prev.current = props.bucketId
            }
        }

    }, [props._connected, props.bucketId])

    useEffect(() => {
        if (props.bucketId) {
            fetchBucketUser();
        }

    }, [props.bucketId, props.refresh]);

    const fetchBucketUser = async () => {
        if (!props.bucketId) {
            return
        }
        updateFetch(true);
        let json = await Api.fetchBucketUser({ id: props.bucketId });

        updateFetch(false);
        if (json && !json.code && json.success) {
            updateList(json.list || []);
            updateTotal(json.total || 0);
        } else {
            updateList([]);
            updateTotal(0);
            message.error(
                <div>
                    Ирцийн мэдээлэл авахад алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    return (
        <Fragment>
            <h3>Ирцийн мэдээлэл</h3>
            <div>Нийт: {total}</div>
            <Table
                columns={userColumn}
                loading={fetch}
                dataSource={list}
                size="small"
                rowKey={'id'}
                pagination={false}
            />
        </Fragment>
    );
})

const ViewBucket = props => {
    const bucket = props.bucket || null;
    if (bucket == null) return null;

    const [starting, updateStarting] = useState(false);
    const [finishing, updateFinishing] = useState(false);
    const [refresh, updateRefresh] = useState('');

    const start = async () => {
        let id = (props.bucket || {}).id || '';
        if (!id) {
            return;
        }

        updateStarting(true);
        let json = await Api.startBucket({ id });

        if (json && !json.code && json.success) {
            props.onChanged({
                type: 'start',
                item: { id, start: json.start }
            });
            updateStarting(false);
        } else {
            updateStarting(false);
            message.error(
                <div>
                    Алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    const finish = async () => {
        let id = (props.bucket || {}).id || '';
        if (!id) {
            return;
        }

        updateFinishing(true);
        let json = await Api.endBucket({ id });

        if (json && !json.code && json.success) {
            props.onChanged({
                type: 'finish',
                item: { id, end: json.end }
            });
            updateFinishing(false);
            updateRefresh(new Date().getTime()) //force refresh 
        } else {
            updateFinishing(false);
            message.error(
                <div>
                    Алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    const changeScreenSize = () => {
        window.open(
            `/operator/attendance/screen/${props.programId}/${props.bucket.id}`,
            '_blank',
            'toolbar=no,status=no,fullscreen=yes,location=no'
        );
    };

    return (
        <Fragment>
            <div style={{ display: 'flex', padding: '20px 0px' }}>
                {(props.bucket.start || '') == '' && (
                    <Button
                        type="primary"
                        style={{ marginRight: '10px' }}
                        onClick={start}
                        disabled={starting}>
                        Эхлүүлэх
                    </Button>
                )}

                {(props.bucket.end || '') == '' &&
                    moment(props.bucket.start).isValid() && (
                        <Button
                            type="primary"
                            style={{ marginRight: '10px' }}
                            onClick={finish}
                            disabled={finishing}>
                            Дуусгах
                        </Button>
                    )}

                <Button
                    type="primary"
                    htmlType="button"
                    onClick={changeScreenSize}>
                    Томосгох
                </Button>
            </div>
            <div
                style={{
                    border: '1px solid grey',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white'
                }}>
                <div
                    style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: '1px solid grey'
                    }}>
                    <div
                        style={{
                            color: 'black',
                            fontSize: '20px',
                            padding: '20px 0px 20px 30px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                        Код: {props.bucket.code || ''}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: '1',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            color: 'black'
                        }}>
                        Кодыг оруулан ирцээ бүртгүүлнэ үү!
                    </div>
                </div>
            </div>
            {moment(props.bucket.start).isValid() && (
                <BucketUser bucketId={props.bucket.id} refresh={refresh}/>
            )}
        </Fragment>
    );
};

const columns = props => {
    return [
        // {
        //     title: 'Д/Д',
        //     render: (text, record, index) => {
        //         return <div>{index + 1}</div>
        //     }
        // },
        {
            title: 'Код',
            dataIndex: 'code'
        },
        {
            title: 'Эхэлсэн',
            dataIndex: 'start',
            render: (text, record, index) => {
                return (
                    <span>
                        {moment(record.start).isValid()
                            ? moment(record.start).format('HH:mm')
                            : ''}
                    </span>
                );
            }
        },
        {
            title: 'Дууссан',
            dataIndex: 'end',
            render: (text, record, index) => {
                return (
                    <span>
                        {moment(record.end).isValid()
                            ? moment(record.end).format('HH:mm')
                            : ''}
                    </span>
                );
            }
        },
        {
            title: 'Ирц',
            dataIndex: 'attend_count'
        },
        {
            title: 'Үйлдэл',
            render: (text, record, index) => {
                return (
                    <div>
                        {!moment(record.start).isValid() && (
                            <Popconfirm
                                title="Ирц бүртгэлийг устгах уу?"
                                type="danger"
                                onConfirm={() => {
                                    props.deleteBucket(record.id);
                                }}
                                okText="Тийм"
                                cancelText="Үгүй"
                                icon={<DeleteOutlined color="red" />}>
                                <Button
                                    type="danger"
                                    style={{ marginLeft: '5px' }}
                                    size="small">
                                    Устгах
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                );
            }
        }
    ];
};

const EventAttendantBucketList = props => {
    const [fetch, updateFetch] = useState(false);
    const [list, updateList] = useState([]);

    useEffect(() => {
        fetchEventAttendantBucket();
    }, [props.programId]);

    const fetchEventAttendantBucket = async () => {
        updateFetch(true);
        let params = { programId: props.programId };

        let json = await Api.fetchEventAttendantBucket(params);

        if (json && !json.code && json.success) {
            let list = json.list || [];
            updateList(list);
            updateFetch(false);
        } else {
            updateList([]);
            updateFetch(false);
            message.error(
                <div>
                    Алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    const [creating, updateCreating] = useState(false);
    const createBucket = async () => {
        updateCreating(true);
        let params = { programId: props.programId };
        let json = await Api.createEventAttendantBucket(params);

        updateCreating(false);
        if (json && !json.code && json.success) {
            fetchEventAttendantBucket(); //reload

            message.success(<div>Амжилттай үүсгэв</div>);
        } else {
            message.error(
                <div>
                    Үүсгэхэд алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    const deleteBucket = async id => {
        let params = { id };
        let json = await Api.deleteEventAttendantBucket(params);
        console.log(json);
        if (json && !json.code) {
            updateList(list => list.filter(one => one.id != id));

            message.success(<div>Амжилттай устгав</div>);
        } else {
            message.error(
                <div>
                    Устгахад алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    const [selected, updateSelected] = useState(null);
    const onBucketSelect = (selectedRow, selectedRows, changeRows) => {
        updateSelected(selectedRow);
    };

    const onChanged = ({ type, item }) => {
        if (type == 'start' || type == 'finish') {
            updateList(list =>
                list.map(one => {
                    if (one.id == item.id) {
                        return { ...one, ...item };
                    }
                    return one;
                })
            );
            if (selected && selected.id == item.id) {
                updateSelected({ ...selected, ...item });
            }
        }
    };

    return (
        <Row gutter={16}>
            <Col span={12}>
                <div style={{ padding: '20px 0px' }}>
                    <Button
                        disabled={creating}
                        type="primary"
                        onClick={createBucket}>
                        Ирц бүртгэл үүсгэх
                    </Button>
                </div>
                <Table
                    rowSelection={{
                        type: 'radio',
                        onSelect: onBucketSelect
                    }}
                    columns={columns({
                        deleteBucket
                    })}
                    loading={fetch}
                    dataSource={list}
                    size="small"
                    rowKey={'id'}
                    pagination={false}
                />
            </Col>
            <Col span={12}>
                {selected && (
                    <ViewBucket
                        bucket={selected}
                        onChanged={onChanged}
                        programId={props.programId}
                    />
                )}
            </Col>
        </Row>
    );
};

export default EventAttendantBucketList;
