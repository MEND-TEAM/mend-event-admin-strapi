import { Tabs } from 'antd';
import querystring from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import EventAttendantBucketList from '../../comps/events/EventAttendantBucketList';
import EventAttendantList from '../../comps/events/EventAttendantList';
import SelectProgram from '../../comps/events/SelectProgram';
const { TabPane } = Tabs;

class Attendance extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: props.tab || 'general'
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    changeTab = key => {
        console.log(key);
        this.setState({ tab: key });
    };

    render() {
        return (
            <div style={{ padding: '20px' }} className="event-list">
                <h3>Ирц</h3>
                <SelectProgram />
                {this.props.selectedProgram ? (
                    <Tabs
                        defaultActiveKey={this.state.tab}
                        onChange={this.changeTab}>
                        <TabPane tab="Ерөнхий" key="general">
                            {this.state.tab == 'general' && (
                                <EventAttendantList
                                    programId={this.props.selectedProgram}
                                />
                            )}
                        </TabPane>
                        <TabPane tab="Явц" key="progress">
                            {this.state.tab == 'progress' && (
                                <EventAttendantBucketList
                                    programId={this.props.selectedProgram}
                                />
                            )}
                        </TabPane>
                    </Tabs>
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

const store = (state, ownProps) => {
    let location = state.router.location || {};
    let query = querystring.parse(location.search.replace('?', ''));
    let page = Number.parseInt(query.page, 10) || 1;
    let tab = query.tab || 'general';

    return {
        selectedEvent: state.app.selectedEvent,
        selectedProgram: state.app.selectedProgram,
        page,
        tab
    };
};

export default connect(store)(Attendance);
