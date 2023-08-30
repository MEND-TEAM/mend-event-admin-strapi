import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSocket } from '../../comps/hooks/socket';
import Api from '../api';
import { PollResult } from './PollList';

const PollScreen = props => {
    const [options, updateOptions] = useState([]);
    const [question, updateQuestion] = useState('');
    const [finish_time, updateFinish] = useState('');
    const [start_time, updateStart] = useState('');
    const [loaded, updateLoaded] = useState(false);

    useEffect(() => {
        fetchPollScreen();
    }, []);

    const { connected } = useSocket({
        rooms: [`program_${props.program}`],
        listeners: [
            {
                event: 'poll',
                callback: data => {
                    console.log('updatePoll', data);
                    if (data.action && data.id) {
                        fetchPollScreen();
                    }
                }
            }
        ]
    });

    const fetchPollScreen = async () => {
        let id = props.poll;
        let json = await Api.fetchPollScreen({ id });

        if (json && !json.code && json.result) {
            let options = json.options || [];
            let question = json.question || '';
            let finish_time = json.finish_time || '';
            let start_time = json.start_time || '';

            updateOptions(options);
            updateQuestion(question);
            updateStart(start_time);
            updateFinish(finish_time);
            updateLoaded(true);
        } else {
            updateOptions([]);
            updateQuestion('');
            updateStart('');
            updateFinish('');
            updateLoaded(true);

            message.error(
                <div>
                    Алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                width: '100%',
                height: '100vh',
                top: '0px',
                left: '0px',
                backgroundColor: 'white'
            }}>
            <Row style={{ height: '100%', minWidth: '500px' }}>
                <Col span={18} offset={3} style={{ height: '100%' }}>
                    <div
                        style={{
                            backgroundColor: '#1D96B2',
                            color: 'white',
                            fontWeight: 'bold',
                            marginTop: '30px',
                            textAlign: 'center'
                        }}>
                        <div
                            style={{
                                margin: '0px auto',
                                fontSize: '18px',
                                padding: '15px 20px 15px 20px'
                            }}>
                            Санал асуулга{' '}
                            {loaded && (
                                <span>
                                    {!moment(start_time).isValid()
                                        ? 'эхлээгүй байна'
                                        : !moment(finish_time).isValid()
                                        ? 'явагдаж байна'
                                        : 'дууссан'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            flex: '1',
                            display: 'flex',
                            borderBottom: '1px solid grey'
                        }}>
                        {/* question div */}
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
                                    padding: '20px 0px 20px 30px'
                                }}>
                                Асуулт:
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: '1',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '18px',
                                    color: 'black',
                                    fontWeight: 'bold'
                                }}>
                                {question || ''}
                            </div>
                        </div>
                        {/* answers div */}
                        <div
                            style={{
                                flex: '1',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                            <div
                                style={{
                                    color: 'black',
                                    fontSize: '20px',
                                    padding: '20px 0px 20px 30px'
                                }}>
                                Хариулт:
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: '1',
                                    padding: '30px 20px 20px 20px',
                                    alignItems: 'center',
                                    fontSize: '18px',
                                    color: 'black'
                                }}>
                                <table>
                                    <tbody>
                                        {(options || []).map((option, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td
                                                        style={{
                                                            verticalAlign:
                                                                'top',
                                                            padding:
                                                                '5px 20px 5px 30px'
                                                        }}>
                                                        {option.option_name} :
                                                    </td>
                                                    <td
                                                        style={{
                                                            verticalAlign:
                                                                'top',
                                                            padding: '5px'
                                                        }}>
                                                        {option.description}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* chart div */}
                    {moment(finish_time).isValid() &&
                        (options || []).length > 0 && (
                            <PollResult
                                pollId={props.poll}
                                options={options}
                            />
                        )}
                </Col>
            </Row>
        </div>
    );
};

const store = (state, ownProps) => {
    let poll = ((ownProps.match || {}).params || {}).poll || '';
    let program = ((ownProps.match || {}).params || {}).program || '';

    return {
        poll,
        program
    };
};

export default connect(store)(PollScreen);
