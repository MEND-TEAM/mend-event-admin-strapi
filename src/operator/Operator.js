import React from 'react';
import { connect } from 'react-redux';
import {
    PageHeader,
    Tag,
    Tabs,
    Button,
    Row,
    Col,
    Table,
    Icon,
    Select
} from 'antd';
import OperatorQuestion from './Question';
import OperatorAttendence from './Attendence';
import WrappedPoll from './Poll';
import axios from 'axios';
import config from '../config';
import Auth from '../lib/auth';
import moment from 'moment';
const { TabPane } = Tabs;

class Operator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            programList: [],
            eventId: null,
            programId: null,
            functionList: {}
        };

        this.state.functionList['test'] = () => {
            return 'Hello, This is test';
        };
    }

    async componentDidMount() {
        const self = this;
        await axios
            .get(
                `${config.API_DOMAIN}/events/list`,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(function(response) {
                if (response.status == 200) {
                    const eventList = response.data;
                    self.setState({ eventList });
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    updateProgramList = async value => {
        const self = this;
        await this.setState({ eventId: value });
        await axios
            .get(
                `${config.API_DOMAIN}/eventprograms/list?event=${value}`,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                }
            )
            .then(function(response) {
                if (response.status == 200) {
                    const programList = response.data;
                    self.setState({ programList });
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    programOnChange = async value => {
        await this.setState({ programId: value });
        this.refresh();
    };

    refresh = () => {
        // const { functionList } = this.state;
        // const arr = Object.keys(functionList);
        // for (let i = 0; i < arr.length; i++) {
        //     functionList[arr[i]]();
        // }
        // Object.keys(functionList).map((key, index) => {
        //     if (key) {
        //         this = functionList[key].obj;
        //         functionList[key].func();
        //     }
        // });
    };

    render() {
        const { event, program } = this.state;
        return (
            <div
                class="attendance-div"
                style={{ padding: '50px 10px 0px 70px', height: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}>
                    <div style={{ paddingBottom: '30px' }}>
                        <Select
                            placeholder="event"
                            name="event"
                            style={{ width: '200px' }}
                            onChange={this.updateProgramList}>
                            {this.state.eventList.map(item => {
                                return (
                                    <Select.Option id={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                        <Select
                            placeholder="program"
                            name="event"
                            style={{ width: '400px', marginLeft: '20px' }}
                            showSearch
                            optionFilterProp="children"
                            // filterOption={(input, option) =>
                            //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            // }
                            onChange={this.programOnChange}>
                            {this.state.programList.map(item => {
                                return (
                                    <Select.Option id={item.id} value={item.id}>
                                        [
                                        {moment(item.open_time).format(
                                            'YYYY.MM.DD HH:mm'
                                        )}
                                        ] {item.title}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </div>
                    <div style={{ flex: '1', backgroundColor: 'blue' }}>
                        <Tabs
                            defaultActiveKey="1"
                            style={{
                                backgroundColor: 'white',
                                height: '100%'
                            }}>
                            <TabPane tab="Attendence" key="1">
                                <OperatorAttendence
                                    eventId={this.state.eventId}
                                    programId={this.state.programId}
                                    functionList={this.state.functionList}
                                />
                            </TabPane>

                            <TabPane tab="Questions" key="2">
                                <OperatorQuestion
                                    eventId={this.state.eventId}
                                    programId={this.state.programId}
                                    functionList={this.state.functionList}
                                />
                            </TabPane>

                            <TabPane tab="Polls" key="3">
                                <WrappedPoll
                                    eventId={this.state.eventId}
                                    programId={this.state.programId}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default Operator;
