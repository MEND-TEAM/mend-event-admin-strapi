import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, message, Popconfirm, Row, Table } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SelectProgram from '../../comps/events/SelectProgram';
// import { updatePoll } from '../../redux/app/actions';
import Api from '../api';
import google from '../chart';
// import Chart from 'react-google-charts';
import PollEditModal from './PollEditModal';

const columns = props => {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '80px'
        },
        {
            title: 'Асуулт',
            dataIndex: 'question'
        },
        {
            title: 'Эхэлсэн',
            dataIndex: 'start_time',
            render: (text, record, index) => {
                return (
                    <span>
                        {moment(record.start_time).isValid()
                            ? moment(record.start_time).format('HH:mm')
                            : ''}
                    </span>
                );
            }
        },
        {
            title: 'Дууссан',
            dataIndex: 'finish_time',
            render: (text, record, index) => {
                return (
                    <span>
                        {moment(record.finish_time).isValid()
                            ? moment(record.finish_time).format('HH:mm')
                            : ''}
                    </span>
                );
            }
        },
        {
            title: 'Үйлдэл',
            render: (text, record, index) => {
                return (
                    <div>
                        {!moment(record.start_time).isValid() && (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => {
                                    props.showEditPollModal(record);
                                }}>
                                Засах
                            </Button>
                        )}
                        {!moment(record.start_time).isValid() && (
                            <Popconfirm
                                title="Сонгосон асуултыг устгах уу?"
                                type="danger"
                                onConfirm={() => {
                                    props.deletePoll(record.id);
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
                        <Button
                            type="primary"
                            size="small"
                            style={{ marginLeft: '5px' }}
                            onClick={() => {
                                props.viewPoll(record);
                            }}>
                            Poll
                        </Button>
                    </div>
                );
            }
        }
    ];
};

const ViewPoll = props => {
    const poll = props.poll || null;
    if (poll == null) return null;

    const [fetch, updateFetch] = useState(false);
    const [options, updateOptions] = useState([]);

    const [starting, updateStarting] = useState(false);
    const [finishing, updateFinishing] = useState(false);

    useEffect(() => {
        updateOptions([]);
        updateStarting(false);
        updateFinishing(false);
        updateFetch(false);
        if (props.poll) {
            fetchPollOptions();
        }
    }, [props.poll]);

    const fetchPollOptions = async () => {
        let event_poll = poll.id;
        updateFetch(true);
        let json = await Api.fetchPollOptions({ event_poll });

        if (json && !json.code) {
            updateOptions(json || []);
            updateFetch(false);
        } else {
            updateOptions([]);
            updateFetch(false);
            message.error(
                <div>
                    Алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    const start = async () => {
        let pollId = (props.poll || {}).id || '';
        if (!pollId) {
            return;
        }

        updateStarting(true);
        let json = await Api.startPoll({ pollId });

        if (
            json &&
            !json.code &&
            json.result &&
            json.data &&
            json.data.eventPoll
        ) {
            let eventPoll = (json.data || {}).eventPoll;
            props.onChanged({
                type: 'start',
                item: { id: eventPoll.id, start_time: eventPoll.start_time }
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
        let pollId = (props.poll || {}).id || '';
        if (!pollId) {
            return;
        }

        updateFinishing(true);
        let json = await Api.finishPoll({ pollId });

        if (
            json &&
            !json.code &&
            json.result &&
            json.data &&
            json.data.eventPoll
        ) {
            let eventPoll = (json.data || {}).eventPoll;
            props.onChanged({
                type: 'finish',
                item: { id: eventPoll.id, finish_time: eventPoll.finish_time }
            });
            updateFinishing(false);
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
            `/operator/poll/screen/${props.programId}/${props.poll.id}`,
            '_blank',
            'toolbar=no,status=no,fullscreen=yes,location=no'
        );
    };

    return (
        <Fragment>
            <div style={{ display: 'flex' }}>
                {(props.poll.start_time || '') == '' && (
                    <Button type="primary" onClick={start} disabled={starting}>
                        Эхлүүлэх
                    </Button>
                )}

                {(props.poll.finish_time || '') == '' &&
                    moment(props.poll.start_time).isValid() && (
                        <Button
                            type="primary"
                            style={{ marginLeft: '10px' }}
                            onClick={finish}
                            disabled={finishing}>
                            Дуусгах
                        </Button>
                    )}

                <Button
                    type="primary"
                    htmlType="button"
                    style={{ marginLeft: '10px' }}
                    onClick={changeScreenSize}>
                    Томосгох
                </Button>
            </div>
            {/* question, answers div */}
            <div
                style={{
                    border: '1px solid grey',
                    display: 'flex',                    
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    marginTop: '20px'
                }}>
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
                                color: 'black'
                            }}>
                            {poll.question || ''}
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
                                {(options || []).map((option, i) => {
                                    return (
                                        <tr key={i}>
                                            <td
                                                style={{
                                                    verticalAlign: 'top',
                                                    padding: '5px 20px 5px 30px'
                                                }}>
                                                {option.option_name} :
                                            </td>
                                            <td
                                                style={{
                                                    verticalAlign: 'top',
                                                    padding: '5px'
                                                }}>
                                                {option.description}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </div>
                    </div>
                </div>
                {/* chart div */}
                {
                    (moment(props.poll.finish_time).isValid() && (options || []).length > 0 ) &&
                    <PollResult pollId={props.poll.id} options={options}/>
                }                
            </div>
        </Fragment>
    );
};

export const PollResult = props => {
    const [fetch, updateFetch] = useState(false)
    const [list, updateList] = useState([])

    useEffect(() => {
        fetchPollResult(props.pollId)
    }, [props.pollId, props.refresh])

    const fetchPollResult = async(poll) => {
        updateFetch(true)
        let json = await Api.fetchPollResult({poll})
        if (json && !json.code) {
            updateList(json || [])
            updateFetch(false)
        } else {
            updateList([])
            updateFetch(false)
            message.error('Санал хураалтын үр дүнг авахад алдаа гарав!')
        }
    }

    const parseData = (list) => {
        let data = (props.options || []).map((opt) => {
            let found = (list || []).find(res => res.option_id == opt.id)
            let count = (found || {}).cnt || 0
            return [opt.option_name, count]            
        })

        return [['Хариулт','тоо'], ...data]
        // return data
    }

    useEffect(() => {
        const drawChart = () => {
            let poll = parseData(list)

           

            var data = google.visualization.arrayToDataTable(poll);
            var count  = data.getNumberOfRows();
            var values = Array(count).fill().map(function(v, i) {
              return data.getValue(i, 1);
            });

            var total =  google.visualization.data.sum(values);
            values.forEach(function(v, i) {                                         
              var key = data.getValue(i, 0);
              var val = data.getValue(i, 1);
              
            
                  data.setFormattedValue(i, 0, key + ' - ' + val + ' (' + (val/total * 100).toFixed(1) + '%)');                  
                //   data.setFormattedValue(i, 0, key + ' - ' + val );                  
            
            });

            var width = Math.max(document.getElementById('chart_cont').offsetWidth, 500)
            var height = Math.min(window.innerHeight - document.getElementById('chart_cont').offsetTop, width*0.5)
            // console.log('width', width)

            var options = {
                title: 'Санал асуулгын дүн - / Нийт оролцогч: (' + total + ') /',
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
    }, [list])
    

    if (fetch || !props.pollId || (list || []).length == 0) return null

    return (
        <Fragment>
        {/* <div style={{display: 'flex'}}>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>График ачаалж байна...</div>}
                data={parseData(list)}
                options={{
                    title: 'Санал асуулгын дүн'                    
                }}                       
            />            

        </div> */}
        <div style={{display: 'flex', overflow: 'hidden'}} id='chart_cont'>
            <div id="chart" style={{ margin:'0px auto' }}></div>
        </div>
        </Fragment>
    )
}

class PollList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editPollModal: false,
            createPollModal: false,

            fetch: false,
            pollList: [],

            selectedPoll: null
        };
    }

    componentDidMount() {
        this.fetchPollList({});
        // this.drawChart();
        // window.addEventListener('resize', this.drawChart);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.selectedProgram !== this.props.selectedProgram &&
            this.props.selectedProgram
        ) {
            this.fetchPollList({});
        }

        // this.drawChart();
    }

    fetchPollList = async filter => {
        const event = this.props.selectedEvent;
        const eventprogram = this.props.selectedProgram;
        if (!event || !eventprogram) {
            this.setState({
                pollList: []
            });
            return;
        }

        let params = {
            event,
            eventprogram
        };

        params = { ...params, ...filter };
        this.setState({ fetch: true });
        let json = await Api.fetchPollList(params);

        if (json && !json.code) {
            let list = json || [];

            this.setState({ pollList: list, selectedPoll: null });
        } else {
            this.setState({
                pollList: []
            });
            message.error(
                <div>
                    Жагсаалт дуудахад алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    drawChart = () => {
        const { poll } = this.props;
        if (!poll || !poll.pollOptions || poll.pollOptions.length < 1) {
            return;
        }
        let pollOptions = poll.pollOptions;
        const drawChart = () => {
            let poll = [];
            poll.push(['Poll', 'Value and Percent']);
            pollOptions.map(option => {
                poll.push([
                    ` ${option.option_name})   ${option.description}`,
                    option.pollCount
                ]);
            });
            var data = google.visualization.arrayToDataTable(poll);

            var options = {
                title: 'Санал асуулгын дүн',
                titleTextStyle: {
                    fontSize: '15'
                },
                legend: {
                    position: 'right',
                    alignment: 'start',
                    textStyle: {
                        fontSize: '16'
                    }
                },
                pieSliceText: 'value-and-percentage',
                sliceVisibilityThreshold: 0
            };

            var context = document.getElementById('chart');
            if (!context) return;
            var chart = new google.visualization.PieChart(context);

            chart.draw(data, options);
        };

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
    };

    showCreatePollModal = () => {
        this.setState({ pollModal: true, poll: null });
    };

    showEditPollModal = poll => {
        this.setState({ pollModal: true, poll });
    };

    closePollModal = () => {
        this.setState({ pollModal: false, poll: null });
    };

    deletePoll = async id => {
        let json = await Api.deletePoll({ id });

        if (json && !json.code && json.result) {
            //success
            this.onChanged({ type: 'delete', item: { id } });
        } else {
            message.error(
                <div>
                    Устгахад алдаа гарав!
                    <div>{json.message}</div>
                </div>
            );
        }
    };

    viewPoll = one => {
        this.setState({ selectedPoll: one });
    };

    onChanged = ({ type, item }) => {
        if (type == 'start' || type == 'finish') {
            let list = (this.state.pollList || []).map(one => {
                if (one.id == item.id) {
                    return { ...one, ...item };
                }
                return one;
            });
            let newState = { pollList: list };
            if (
                this.state.selectedPoll &&
                this.state.selectedPoll.id == item.id
            ) {
                let newSelectedPoll = { ...this.state.selectedPoll, ...item };
                newState = { ...newState, selectedPoll: newSelectedPoll };
            }

            this.setState(newState);
        } else if (type == 'delete') {
            let list = (this.state.pollList || []).filter(
                one => one.id != item.id
            );
            let newState = { pollList: list };
            if (
                this.state.selectedPoll &&
                this.state.selectedPoll.id == item.id
            ) {
                newState = { ...newState, selectedPoll: null };
            }
            this.setState(newState);
        } else if (type == 'add' || type == 'update') {
            this.fetchPollList({});
        }
    };

    render() {
        const { pollList = [], selectedPoll = null } = this.state;

        return (
            <div style={{ padding: '20px' }} className="event-list">
                <h3>Санал асуулга</h3>
                {/* eventlist, programlist */}
                <SelectProgram />
                {this.props.selectedProgram ? (
                    <Fragment>
                        <Row gutter={16}>
                            <Col xl={12} lg={24}>
                                <div style={{ display: 'flex' }}>
                                    <Button
                                        type="primary"
                                        onClick={this.showCreatePollModal}>
                                        Шинэ
                                    </Button>
                                </div>

                                <Table
                                    style={{
                                        backgroundColor: 'white',
                                        marginTop: '20px',
                                        fontSize: '14px'
                                    }}
                                    columns={columns({
                                        viewPoll: this.viewPoll,
                                        deletePoll: this.deletePoll,
                                        showEditPollModal: this
                                            .showEditPollModal
                                    })}
                                    dataSource={pollList}
                                    size="small"
                                    pagination={false}
                                    rowKey="id"
                                />
                            </Col>
                            <Col xl={12} lg={24}>
                                {selectedPoll && (
                                    <ViewPoll
                                        programId={this.props.selectedProgram}
                                        poll={selectedPoll}
                                        onChanged={this.onChanged}
                                    />
                                )}
                            </Col>
                        </Row>

                        {this.state.pollModal && (
                            <PollEditModal
                                poll={this.state.poll}
                                event={this.props.selectedEvent}
                                program={this.props.selectedProgram}
                                onClose={this.closePollModal}
                                onChanged={this.onChanged}
                            />
                        )}
                    </Fragment>
                ) : (
                    <div
                        style={{
                            padding: '30px 20px 20px 70px',
                            fontSize: '18px'
                        }}>
                        {this.props.selectedEvent ? (
                            <div>Хөтөлбөр сонгоно уу!</div>
                        ) : (
                            <div>Эвэнт сонгоно уу!</div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const store = state => ({
    selectedEvent: state.app.selectedEvent,
    selectedProgram: state.app.selectedProgram
});

export default connect(store)(PollList);
