import React from 'react';
import { Tabs } from 'antd';
import ProgramGeneralInfo from './ProgramGeneralInfo';
import ProgramQuestion from './ProgramQuestion';
import ProgramPoll from './ProgramPoll';
import ProgramExhibition from './ProgramExhibition'
import ProgramSpeaker from './ProgramSpeaker'
import Api from './api'


const { TabPane } = Tabs;

class ProgramDetail extends React.Component {

    
    onProgramSuccess = () => {
        console.log('ProramDetails onSuccess called')
        this.props.onSuccess()
    }

    getSpeakers() {
        axios.post(`${config.API_DOMAIN}/eventspeakers`, '', {
            headers: {
                'Authorization': 'Bearer ' + Auth.getToken()
            }
        })
            .then(function (response) {
                console.log(response);
                this.setState({ ...this.state, speakers: response });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {
        const { eventId, programId, roomList } = this.props;
        console.log('Program Detail rooms', roomList)
        return (
            <Tabs tabPosition="left" style={{marginLeft: '70px', width: '100%' }}>
                <TabPane tab="General Info" key="1">
                    <ProgramGeneralInfo eventId={eventId} programId={programId} onSuccess={this.onProgramSuccess} roomList={roomList}/>
                </TabPane>

                <TabPane tab="Speaker" key="2" disabled={programId == 0}>
                    <ProgramSpeaker eventId={eventId} programId={programId} />
                </TabPane>

                <TabPane tab="Questions" key="3" disabled={programId == 0}>
                    <ProgramQuestion eventId={eventId} programId={programId} />
                </TabPane>

                <TabPane tab="Poll" key="4" disabled={programId == 0}>
                    <ProgramPoll eventId={eventId} programId={programId} />
                </TabPane>

                {/* <TabPane tab="Exhibition" key="5" disabled={programId == 0}>
                    <ProgramExhibition eventId={eventId} programId={programId} />
                </TabPane> */}
                
            </Tabs>
        );
    }
}

export default ProgramDetail;