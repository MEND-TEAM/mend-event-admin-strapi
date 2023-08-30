import { Col, message, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BucketUser } from '../../comps/events/EventAttendantBucketList';
import google from '../chart';
import { useSocket } from '../../comps/hooks/socket';
import Api from '../api';

const AttendanceScreen = props => {
    const [start, updateStart] = useState('');
    const [end, updateEnd] = useState('');
    const [loaded, updateLoaded] = useState('');
    const [code, updateCode] = useState('');
    const [total, updateTotal] = useState(0);
    const [registered, updateRegistered] = useState(0);
    const [refresh, updateRefresh] = useState('')

    const { connected } = useSocket({
        rooms: [`program_${props.program}`],
        listeners: [
            {
                event: 'bucket',
                callback: data => {
                    console.log('updateAttendance', data);
                    if (data.action && data.id) {
                        fetchAttendanceScreen();

                        updateRefresh(new Date().getTime()) //force refresh
                    }
                }
            }
        ]
    });

    useEffect(() => {
        fetchAttendanceScreen();
    }, []);

    const fetchAttendanceScreen = async () => {
        let id = props.bucket;
        let json = await Api.fetchAttendanceScreen({ id });

        if (json && !json.code && json.result) {
            let code = json.check_code || '';
            let end = json.end || '';
            let start = json.start || '';
            let total = json.total || '';
            let registered = json.registered || '';

            updateCode(code);
            updateStart(start);
            updateEnd(end);
            updateTotal(total);
            updateRegistered(registered);
            updateLoaded(true);
        } else {
            updateCode('');
            updateStart('');
            updateEnd('');
            updateTotal(0);
            updateRegistered(0)
            updateLoaded(true);

            message.error(
                <div>
                    Алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    useEffect(() => {
        const drawChart = () => {
            let reg =  [
                ['Хариулт', 'тоо'],
                ['Бүртгүүлсэн', registered],
                ['Бүртгүүлээгүй', total - registered]
            ];
            
            var data = google.visualization.arrayToDataTable(reg);
            var count = data.getNumberOfRows();
            var values = Array(count)
                .fill()
                .map(function(v, i) {
                    return data.getValue(i, 1);
                });

            var totalNum = google.visualization.data.sum(values);
            values.forEach(function(v, i) {
                var key = data.getValue(i, 0);
                var val = data.getValue(i, 1);

                data.setFormattedValue(
                    i,
                    0,
                    key +
                        ' - ' +
                        val +
                        ' (' +
                        ((val / totalNum) * 100).toFixed(1) +
                        '%)'
                );
            });

            var width = Math.max(
                document.getElementById('chart_cont').offsetWidth,
                500
            );
            var height = Math.min(
                window.innerHeight -
                    document.getElementById('chart_cont').offsetTop,
                width * 0.5
            );
            // console.log('width', width)

            var options = {
                title:
                    'Ирцийн дүн',
                width,
                height
            };

            var context = document.getElementById('chart');
            if (!context) return;
            var chart = new google.visualization.PieChart(context);

            chart.draw(data, options);
        };

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        window.addEventListener('resize', () => {
            drawChart();
        });
    }, [total, registered]);

    return (
        <div
            id="attendance-screen"
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
                            Ирц бүртгэл{' '}
                            {loaded && (
                                <span>
                                    {!moment(start).isValid()
                                        ? 'эхлээгүй байна'
                                        : !moment(end).isValid()
                                        ? 'явагдаж байна'
                                        : 'дууссан'}
                                </span>
                            )}
                        </div>
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
                                    padding: '20px 0px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                Код: {code || ''}
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
                    <div style={{display: 'flex', overflow: 'hidden'}} id='chart_cont'>
                        <div id="chart" style={{ margin:'0px auto' }}></div>
                    </div>
                    <div
                        style={{
                            flex: '3',
                            height: '100%',
                            padding: '20px 0px',
                            fontSize: '20px'
                        }}>                       
                        {moment(start).isValid() && (
                            <BucketUser bucketId={props.bucket} refresh={refresh}/>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const store = (state, ownProps) => {
    let bucket = ((ownProps.match || {}).params || {}).bucket || '';
    let program = ((ownProps.match || {}).params || {}).program || '';

    return {
        bucket,
        program
    };
};

export default connect(store)(AttendanceScreen);
