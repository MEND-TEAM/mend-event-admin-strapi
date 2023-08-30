import { Button, Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import Api from '../api';
// import {useSpeakersByProgram} from '../comps/hooks/speaker'
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
const QuestionEditModal = props => {
    const [saving, updateSaving] = useState(false);
    // const {list:speakers} = useSpeakersByProgram(props)

    const [form] = Form.useForm();

    useEffect(() => {
        if (props.question) {
            form.setFieldsValue({
                question: props.question.question,
                eventspeaker: props.question.eventspeaker || ''
            });
        } else {
            form.setFieldsValue({
                question: '',
                eventspeaker: ''
            });
        }
    }, [props.question]);

    const close = (force = false) => {
        if (!force && saving) {
            return false;
        }
        form.resetFields();
        updateSaving(false);
        props.onClose();
    };

    const save = async values => {
        const id = (props.question || {}).id || '';
        const event = props.event || '';
        const program = props.program || '';
        const question = values['question'] || '';
        const eventspeaker = values['eventspeaker'] || '';

        updateSaving(true);
        let json = await Api.saveQuestion({ id, question, event, program, eventspeaker });

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
                ((props.question || {}).id || '') == ''
                    ? 'Асуулт үүсгэх'
                    : 'Асуулт засах'
            }
            className="program-modal"
            header={null}
            visible={true}
            footer={null}
            onCancel={() => {
                close();
            }}>
            <Form {...customItemLayout} form={form} onFinish={save}>
                <Form.Item
                    label="Aсуулт"
                    name="question"
                    rules={[
                        { required: true, message: 'Асуулт хоосон байна!' }
                    ]}>
                    <TextArea rows={4} style={{ padding: '8px' }} />
                </Form.Item>
                <Form.Item
                    label="Хэнээс"
                    name="eventspeaker"
                    valuePropName="value">
                    <Select style={{ width: '60%' }}>
                        {(props.speakers || []).map(item => {
                            return <Option value={item.speaker_id}>{item.speaker_name}</Option>;
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...customTailLayout}>
                    <Button htmlType="submit" type="primary">
                        Хадгалах
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuestionEditModal;
