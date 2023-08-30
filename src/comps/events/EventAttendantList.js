import { Button, Col, Form, Input, message, Modal, Row, Table } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import Api from './api';
const { Search } = Input;

const customItemLayout = {
    labelCol: {
        xs: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 18 }
    }
};
const customTailLayout = {
    wrapperCol: {
        xs: { span: 18, offset: 6 }
    }
};

const UserModal = props => {
    const [saving, updateSaving] = useState(false);

    const [form] = Form.useForm();

    const close = (force = false) => {
        if (!force && saving) {
            return;
        }
        updateSaving(false);
        props.onClose();
    };

    const save = async values => {
        let formData = new FormData();
        Object.keys(values).map(key => {
            formData.append(key, values[key] || '');
        });
        let phone = values['phone']
        formData.append('username', phone);
        updateSaving(true);
        let json = await Api.createUser(formData);

        updateSaving(false);
        
        if (json && !json.code && json.result) {
            let item = {id: json.data.user.id, phone};
            props.onChanged({ type: 'created', item });
            close(true);
            message.success(<div>Амжилттай хадгалав!</div>);
        } else {
            message.error(
                <div>
                    Хадгалахад алдаа гарав!<div>{json.message || ''}</div>
                </div>
            );
        }
    };

    return (
        <Modal
            title={'Гишүүн нэмэх'}
            className="program-modal"
            width="%"
            header={null}
            visible={true}
            footer={null}
            onCancel={() => {
                close();
            }}>
            <Form {...customItemLayout} form={form} onFinish={save}>
                <Form.Item label="Нэр" name="firstname" rules={[
                        { required: true, message: 'Нэр оруулна уу!' }
                    ]}>
                    <Input type="text" />
                </Form.Item>

                <Form.Item label="Овог" name="lastname" rules={[
                        { required: true, message: 'Овог оруулна уу!' }
                    ]}>
                    <Input type="text" />
                </Form.Item>

                <Form.Item label="Утас" name="phone" rules={[
                        { required: true, message: 'Утас оруулна уу!' }
                    ]}>
                    <Input type="text" />
                </Form.Item>

                <Form.Item label="Регистер" name="register_number">
                    <Input
                        type="text"
                        style={{
                            textTransform: 'uppercase'
                        }}
                    />
                </Form.Item>

                <Form.Item {...customTailLayout}>
                    <Button htmlType="submit" type="primary" disabled={saving}>
                        Хадгалах
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
const searchColumn = [
    {
        title: 'Нэр',
        dataIndex: 'firstname'
    },
    {
        title: 'Овог',
        dataIndex: 'lastname'
    },
    {
        title: 'Регистрийн дугаар',
        dataIndex: 'register_number'
    },
    {
        title: 'Утас',
        dataIndex: 'phone'
    },
    {
        title: 'Ирц өгсөн',
        dataIndex: 'attend',
        render: (text, record, index) => {
            return <div>{(record.attend || 0) > 0 ? 'Тийм' : ''}</div>;
        }
    }
];
const AttendeeAddModal = props => {
    const [saving, updateSaving] = useState(false);
    const [searching, updateSearching] = useState(false);
    const [list, updateList] = useState([]);
    const [selected, updateSelected] = useState(null);
    const [phone, updatePhone] = useState('');

    const close = (force = false) => {
        if (!force && saving) {
            return;
        }
        updateSaving(false);
        updateSelected(null);
        updateSearching(false);
        updatePhone('')
        props.onClose();
    };

    const searchUser = async value => {
        if (!value || value.length < 3) {
            message.info('3-с илүү тоо оруулна уу');
            return;
        }
        updateSearching(true);
        updateList([]);
        updateSelected(null);
        let json = await Api.searchUser({
            phone: value,
            programId: props.programId
        });

        if (json && !json.code && json.success) {
            updateSearching(false);
            updateList(json.list || []);
        } else {
            updateSearching(false);
            updateList([]);
            message.error(
                <div>
                    Хэрэглэгч хайхад алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    const onUserSelect = (selectedRow, selectedRows, changeRows) => {
        console.log('onUserSelect', selectedRow);
        updateSelected(selectedRow);
    };

    const addToAttendance = async () => {
        if (selected) {
            let programId = props.programId;
            let userId = selected.id;
            updateSaving(true);
            let json = await Api.addEventProgramAttendant({
                programId,
                userId
            });
            if (json && !json.code && json.success) {
                //reg success
                props.onChanged({ type: 'register' });
                close(true);
                message.success(<div>Ирцэд амжилттай нэмэв!</div>);
            } else {
                updateSaving(false);
                message.error(
                    <div>
                        Ирцэд нэмэхэд алдаа гарав!<div>{json.message}</div>
                    </div>
                );
            }
        }
    };

    const [modal, updateModal] = useState(false);
    const openUserModal = () => {
        updateModal(true);
    };

    const closeUserModal = () => {
        updateModal(false);
    };

    const onChanged = ({ type, item }) => {
        if (type == 'created') {
            updatePhone(item.phone)
            searchUser(item.phone)
        }
    };

    return (
        <Modal
            title={'Ирц бүртгэл'}
            className="program-modal"
            width="70%"
            header={null}
            visible={true}
            footer={null}
            onCancel={() => {
                close();
            }}>
            <div>Хэрэглэгч хайх</div>
            <Row style={{ marginBottom: '20px' }}>
                <Col span={16}>
                    <Search
                        onChange={(ev) => updatePhone(ev.target.value)}
                        value={phone}
                        placeholder="Утасны дугаар оруулна уу"
                        onSearch={value => searchUser(value)}
                        enterButton
                        disabled={searching || saving}
                    />
                </Col>
                <Col span={8}>
                    <Button
                        disabled={!selected || saving}
                        type="primary"
                        onClick={addToAttendance}
                        style={{ marginLeft: '20px' }}>
                        Ирцэд бүртгэх
                    </Button>

                    <Button
                        type="primary"
                        onClick={openUserModal}
                        style={{ marginLeft: '20px' }}>
                        Гишүүн бүртгэх
                    </Button>
                </Col>
            </Row>
            <Table
                rowSelection={{
                    type: 'radio',
                    onSelect: onUserSelect,
                    getCheckboxProps: record => ({
                        disabled: (record.attend || 0) > 0 // Column configuration not to be checked
                    })
                }}
                disabled={saving}
                columns={searchColumn}
                loading={searching}
                dataSource={list}
                size="small"
                rowKey={'id'}
                pagination={false}
            />

            {modal && (
                <UserModal onClose={closeUserModal} onChanged={onChanged} />
            )}
        </Modal>
    );
};
const columns = [
    // {
    //     title: 'Д/Д',
    //     render: (text, record, index) => {
    //         return <div>{index + 1}</div>
    //     }
    // },
    {
        title: 'Нэр',
        dataIndex: 'firstname'
    },
    {
        title: 'Овог',
        dataIndex: 'lastname'
    },
    {
        title: 'Регистрийн дугаар',
        dataIndex: 'register_number'
    },
    {
        title: 'Утас',
        dataIndex: 'phone'
    },
    {
        title: 'Огноо',
        dataIndex: 'created_at',
        render: (text, record, index) => {
            return (
                <div>
                    {moment(text).isValid()
                        ? moment(text).format('HH:mm MM.DD')
                        : ''}
                </div>
            );
        }
    }
];

const EventAttendantList = props => {
    const [fetch, updateFetch] = useState(false);
    const [list, updateList] = useState([]);
    const [total, updateTotal] = useState(0);
    const [page, updatePage] = useState(1);
    const [max, updateMax] = useState(15);

    useEffect(() => {
        fetchEventAttendant({ page: 1 });
    }, [props.programId]);

    const fetchEventAttendant = async filter => {
        updateFetch(true);
        let params = { programId: props.programId };
        params = { ...params, ...filter };

        let json = await Api.fetchEventProgramAttendant(params);

        if (json && !json.code && json.success) {
            let total = json.total || 0;
            let list = json.list || [];
            // let page = json.page || 1
            // updatePage(page)
            updateTotal(total);
            updateList(list);
            updateFetch(false);
        } else {
            // updatePage(1)
            updateTotal(0);
            updateList([]);
            updateFetch(false);
            message.error(
                <div>
                    Алдаа гарав!<div>{json.message}</div>
                </div>
            );
        }
    };

    const onPageChange = (pagination, filters, sorter) => {
        let currentPage = pagination.current;

        if (page != currentPage) {
            updatePage(currentPage);
            fetchEventAttendant({ page });
        }
    };

    const [modal, updateModal] = useState(false);
    const openAddModel = () => {
        updateModal(true);
    };

    const closeAddModal = () => {
        updateModal(false);
    };

    const onChanged = ({ type, item }) => {
        if (type == 'register') {
            fetchEventAttendant({ page: 1 });
        }
    };

    return (
        <Fragment>
            <div style={{ padding: '20px 0px' }}>
                <Button
                    type="primary"
                    onClick={openAddModel}>
                    Ирц бүртгэх
                </Button>
            </div>
            <Table
                columns={columns}
                loading={fetch}
                dataSource={list}
                size="small"
                rowKey={'user_id'}
                onChange={onPageChange}
                pagination={{
                    current: page,
                    pageSize: max,
                    total
                }}
            />

            {modal && (
                <AttendeeAddModal
                    onClose={closeAddModal}
                    onChanged={onChanged}
                    programId={props.programId}
                />
            )}
        </Fragment>
    );
};

export default EventAttendantList;
