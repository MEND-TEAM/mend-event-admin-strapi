import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space, Spin } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import Api from '../api';
const { TextArea } = Input;

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
const OPTION_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const PollEditModal = props => {
    const [fetch, updateFetch] = useState(false)
    const [saving, updateSaving] = useState(false);
    
    const [form] = Form.useForm();

    useEffect(() => {
        if (props.poll) {
            form.setFieldsValue({
                question: props.poll.question,
                options: [{
                    description: "dddd",
                    option_name: "A"
                }]
            });

            fetchOptions(props.poll)
        } else {
            form.setFieldsValue({
                question: ''                
            });
        }
    }, [props.poll]);

    const close = (force = false) => {
        if (!force && saving) {
            return false;
        }
        form.resetFields();
        updateSaving(false);
        props.onClose();
    };

    const fetchOptions = async(poll) => {
        let event_poll = poll.id;
        updateFetch(true);
        let json = await Api.fetchPollOptions({ event_poll });

        if (json && !json.code) {
            let options = json || []
            form.setFieldsValue({                
                options
            });
            updateFetch(false);
        } else {
            
            updateFetch(false);            
        }

    }

    const save = async values => {
        console.log('values', values)
        const id = (props.poll || {}).id || '';
        const event = props.event || '';
        const program = props.program || '';
        const question = values['question'] || '';
        const options = values['options'] || []

        updateSaving(true);
        let json = await Api.savePoll({ id, question, event, program, options });

        if (json && !json.code) {
            props.onChanged({ type: id ? 'update' : 'add' });
            close(true);
        } else {
            updateSaving(false);
            message.error(<div>Хадгалахад алдаа гарав!</div>);
        }
    };

    return (
        <Modal
            title={
                ((props.poll || {}).id || '') == ''
                    ? 'Санал асуулга үүсгэх'
                    : 'Санал асуулга засах'
            }
            className="program-modal"
            width="70%"
            header={null}
            visible={true}
            footer={null}
            onCancel={() => {
                close();
            }}>
            {
                fetch ?            
                <Spin/>
                :
            <Form {...customItemLayout} form={form} onFinish={save}>
                <Form.Item
                    label="Aсуулт"
                    name="question"
                    rules={[
                        { required: true, message: 'Асуулт хоосон байна!' }
                    ]}>
                    <TextArea rows={4} style={{ padding: '8px' }} />
                </Form.Item>
                <Form.List name='options' >
                    {(fields, {add, remove}) => {
                        return (<Fragment>
                            {
                                fields.map((field, i) => {
                                    return (
                                        <Form.Item
                                            {...(i === 0 ? customItemLayout : customTailLayout)}
                                                label={i === 0 ? 'Хариултууд' : ''}
                                                required={false}
                                                key={i}
                                            >
                                            <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                                <Form.Item
                                                    {...field}
                                                    label='Сонголт'
                                                    name={[field.name, 'option_name']}                                                
                                                    rules={[{ required: true, message: 'Сонголт оруулна уу' }]}
                                                >
                                                    <Input placeholder="Сонголт оруулна уу" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label='Утга'
                                                    name={[field.name, 'description']}                                                
                                                    rules={[{ required: true, message: 'Утга оруулна уу' }]}
                                                >
                                                    <Input placeholder="Утга оруулна уу" />
                                                </Form.Item>
                                                {
                                                    ((fields.length - 1) == i ) &&
                                                    <MinusCircleOutlined
                                                        onClick={() => {
                                                        remove(field.name);
                                                    }}/>
                                                }
                                            </Space>
                                        </Form.Item>
                                    )
                                })
                            }
                            <Form.Item {...customTailLayout}>
                                <Button
                                    type="dashed"
                                        onClick={() => {
                                            add({option_name: OPTION_NAMES[fields.length], description: ''});
                                    }}
                                    block
                                >
                                    <PlusOutlined /> Хариулт нэмэх
                                </Button>
                            </Form.Item>
                        </Fragment>)
                    }}
                </Form.List>
                
                <Form.Item {...customTailLayout}>
                    <Button htmlType="submit" type="primary">
                        Хадгалах
                    </Button>
                </Form.Item>
            </Form>
                
                
            }
        </Modal>
    );
};

export default PollEditModal;
