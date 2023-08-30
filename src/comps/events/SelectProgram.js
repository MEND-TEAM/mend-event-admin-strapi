import { Col, Row, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import {
    eventChanged,
    programChanged,
    setEventList,
    setProgramList
} from '../../redux/app/actions';
import Api from './api';

const { Option } = Select;

class SelectProgram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchEvent: false,
            fetchProgram: false
        };
    }

    componentDidMount() {
        if ((this.props.eventList || []).length == 0) {
            this.fetchEventList();
        } else if (
            this.props.selectedEvent &&
            (this.props.programList || []).length == 0
        ) {
            this.fetchProgramList(this.props.selectedEvent);
        }
    }

    fetchEventList = async () => {
        this.setState({ fetchEvent: true });
        let json = await Api.fetchEventList();

        this.setState({ fetchEvent: false });
        if (json && !json.code) {
            const list = (json || []).map(item => {
                return {
                    id: item.id,
                    name: item.name
                };
            });
            this.props.dispatch(setEventList(list));
        }
    };

    onEventChange = async value => {
        this.props.dispatch(eventChanged(value));
        this.props.dispatch(programChanged(''));
        this.fetchProgramList(value);
    };

    onProgramChange = value => {
        this.props.dispatch(programChanged(value));
    };

    fetchProgramList = async eventId => {
        this.setState({ fetchProgram: true });
        let json = await Api.fetchProgramList({ eventId });
        this.setState({ fetchProgram: false });
        if (json && !json.code) {
            let list = json || [];
            this.props.dispatch(setProgramList(list));
        }
    };

    render() {
        const {
            selectedEvent,
            selectedProgram,
            programList,
            eventList
        } = this.props;

        return (
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Select
                        disabled={this.state.fetchEvent}
                        placeholder="Эвент"
                        name="event"
                        showSearch
                        optionFilterProp="children"
                        onChange={this.onEventChange}
                        value={selectedEvent}
                        style={{width: '400px', marginRight: '16px', marginBottom:'16px'}}
                        allowClear
                        >
                        {eventList.map(item => {
                            return (
                                <Option
                                    key={item.id}
                                    id={item.id}
                                    value={item.id.toString()}>
                                    [{item.id}] {item.name}
                                </Option>
                            );
                        })}
                    </Select>

                    <Select
                        disabled={this.state.fetchProgram}
                        allowClear
                        placeholder="Хөтөлбөр"
                        name="program"
                        showSearch
                        optionFilterProp="children"
                        onChange={this.onProgramChange}
                        value={selectedProgram}
                        style={{width: '400px'}}>
                        {programList.map(item => {
                            return (
                                <Option
                                    key={item.id}
                                    id={item.id}
                                    value={item.id}>
                                    [{moment(item.open_time).format('HH:mm')}]{' '}
                                    {item.title}
                                </Option>
                            );
                        })}
                    </Select>
                </Col>
            </Row>
        );
    }
}

const store = state => ({
    selectedEvent: state.app.selectedEvent,
    selectedProgram: state.app.selectedProgram,
    eventList: state.app.eventList,
    programList: state.app.programList
});

export default connect(store)(SelectProgram);
