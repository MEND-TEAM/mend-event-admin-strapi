import { Button, Col, Input, message, Modal, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Api from '../api';
const { TextArea } = Input;

const options = [
    { label: 'Давхардсан', value: 'duplicated' },
    { label: 'Сонголтод нэмэх', value: 'confirmed' }
];

const QuestionProcessModal = props => {
    const [saving, updateSaving] = useState(false);
    const [confirm, updateConfirm] = useState('');

    useEffect(() => {
        updateConfirm('');
    }, [props.question]);

    const close = (force = false) => {
        if (!force && saving) {
            return false;
        }
        updateConfirm('');
        updateSaving(false);
        props.onClose();
    };

    const save = async () => {
        const id = (props.question || {}).id || '';
        const event = props.event || '';
        const program = props.program || '';
        if (!confirm) {
            message.info('Төрөл сонгоно уу');
            return;
        }

        updateSaving(true);
        let json = await Api.processQuestion({ id, confirm });

        if (json && !json.code) {
            if (json.success || false) {
                props.onChanged({ type: 'process', action: confirm });
                close(true);
            } else {
                updateSaving(false);
                message.error(<div>Хадгалахад алдаа гарав!</div>);
            }
        } else {
            updateSaving(false);
            message.error(<div>Хадгалахад алдаа гарав!</div>);
        }
    };

    return (
        <Modal
            title={'Асуултын тохиргоо'}
            className="program-modal"
            header={null}
            visible={true}
            footer={null}
            onCancel={() => {
                close();
            }}>
            <div>
                <Row gutter={[16, 16]}>
                    <Col span={4}>Асуулт:</Col>
                    <Col span={20}>{props.question.question}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={4}>Төрөл:</Col>
                    <Col span={20}>
                        <Radio.Group
                            options={options}
                            onChange={e => {
                                updateConfirm(e.target.value);
                            }}
                            value={confirm}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Col>
                </Row>
            </div>
            <Button type="primary" onClick={save}>
                Хадгалах
            </Button>
        </Modal>
    );
};

export default QuestionProcessModal;
