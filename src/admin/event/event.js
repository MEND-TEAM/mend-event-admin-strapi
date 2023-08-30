import React from 'react';
import { connect } from 'react-redux';
import { Tabs} from 'antd';

import EventEdit from './event_edit'
import Speaker from '../speaker/speaker'
import EventProgram  from '../program/EventProgram'
import Room from '../room/Room';
import Participant from '../participant/Participant'
import Question from '../faq/Question';


import EventPackage from '../package/EventPackage'


const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

class Event extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            eventId: props.id || '',
        }
    }

    render(){
        const{ eventId } = this.state
        return (
            <div className="container">
            <Tabs defaultActiveKey="1" onChange={callback} style={{ marginLeft: '50px' }}>
                <TabPane tab="General Info" key="1">
                   <EventEdit eventId={eventId}/>
                </TabPane>
                
                <TabPane tab="Speakers" key="2">
                    <Speaker eventId={eventId}/>
                </TabPane>

                <TabPane tab="Rooms" key="3">
                    <Room eventId={eventId}/>
                </TabPane>

                <TabPane tab="Participants" key="4">
                    <Participant eventId={eventId}/>
                </TabPane>

                <TabPane tab="Programs" key="5">
                    <EventProgram eventId={eventId} />
                </TabPane>

                <TabPane tab="FAQ's" key="6">
                   <Question eventId={eventId}/>
                </TabPane>

                <TabPane tab="Package" key="7">
                   <EventPackage eventId={eventId}/>
                </TabPane>            
            </Tabs>
        </div>         
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let id = ((ownProps.match || {}).params || {}).id || ''
    return {              
        id,
    }
}
export default connect(mapStateToProps)(Event);