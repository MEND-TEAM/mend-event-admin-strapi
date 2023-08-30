import { DislikeOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSocket } from '../../comps/hooks/socket';
import Api from '../api';

const QuestionScreen = props => {
    const [list, updateList] = useState([]);
    const [speakers, updateSpeakers] = useState([]);

    const { connected } = useSocket({
        rooms: [
            `program_${props.program}`
        ],
        listeners:[
            {
                event: 'question',
                callback: (data) => {
                    console.log('updateQuestion', data)
                    if (data.action && data.id) {
                        fetchSelectedQuestions()
                    }
                }
            }
        ]
    });


    useEffect(() => {
        fetchSpeaker();
        fetchSelectedQuestions();
    }, []);

    const fetchSpeaker = async () => {
        let program = props.program;
        let json = await Api.fetchSpeakersByProgram({ event_program: program });

        if (json && !json.code && json.result) {
            let speakers = json.data || [];
            updateSpeakers(speakers);
        } else {
            updateSpeakers([]);
        }
    };

    const fetchSelectedQuestions = async () => {
        const eventId = props.event;
        const programId = props.program;

        if (!eventId || !programId) {
            return;
        }

        let params = {
            eventId,
            programId,
            page: 1,
            status: 'confirmed',
            hideAnswered: true,
            sortField: 'order',
            max: 50
        };
        params = { ...params };
        let json = await Api.fetchQuestionList(params);

        if (json && !json.code) {
            let list = (json.list || []).map(o => {
                return { ...o, rate: parseInt(o.up - o.down) };
            });
            updateList(list);
        } else {
            //donothing
        }
    };

    return (
        <div
            id="question-screen"
            style={{
                position: 'fixed',
                width: '100%',
                height: '100vh',
                top: '0px',
                left: '0px',
                backgroundColor: 'white'
            }}>
            <Row style={{ height: '100%' }}>
                <Col span={18} offset={3} style={{ height: '100%' }}>
                    <table
                        style={{
                            fontSize: '18px',
                            width: '100%',
                            borderRadius: '5px',
                            marginTop: '30px'
                        }}>
                        <thead
                            style={{
                                backgroundColor: '#1D96B2',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '5px'
                            }}>
                            <td style={{ padding: '15px 20px 15px 20px' }}>
                                ID
                            </td>
                            <td style={{ padding: '15px 20px 15px 20px' }}>
                                Асуулт
                            </td>
                            <td style={{ padding: '15px 20px 15px 20px' }}>
                                Хэнээс
                            </td>
                            <td style={{ padding: '15px 20px 15px 20px' }}>
                                <StarOutlined />
                            </td>
                            <td style={{ padding: '15px 20px 15px 20px' }}>
                                <LikeOutlined />
                            </td>
                            <td style={{ padding: '15px 20px 15px 20px' }}>
                                <DislikeOutlined />
                            </td>
                        </thead>
                        <tbody>
                            {list.map((question, index) => {
                                let color = '';
                                if (index % 2 == 1) {
                                    color = '#FAFAFA';
                                }
                                return (
                                    <tr key={index}
                                        style={{
                                            backgroundColor: `${color}`
                                        }}>
                                        <td
                                            style={{
                                                padding: '10px',
                                                width: '60px',
                                                textAlign: 'center'
                                            }}>
                                            {question.id}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px 20px 10px 20px'
                                            }}>
                                            {question.question}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px 20px 10px 20px'
                                            }}>
                                            {(
                                                speakers.find(
                                                    one =>
                                                        one.speaker_id ==
                                                        question.eventspeaker
                                                ) || {}
                                            ).speaker_name || ''}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px',
                                                width: '60px',
                                                textAlign: 'center'
                                            }}>
                                            {question.rate}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px',
                                                width: '60px',
                                                textAlign: 'center'
                                            }}>
                                            {question.up}
                                        </td>
                                        <td
                                            style={{
                                                padding: '10px',
                                                width: '60px',
                                                textAlign: 'center'
                                            }}>
                                            {question.down}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </div>
    );
};

const store = (state, ownProps) => {
    let event = ((ownProps.match || {}).params || {}).event || '';
    let program = ((ownProps.match || {}).params || {}).program || '';

    return {
        event,
        program
    };
};

export default connect(store)(QuestionScreen);
