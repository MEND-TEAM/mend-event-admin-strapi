import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class EventUser extends React.Component{
    constructor(props){
        super(props);
    }
    render (){
        return (
            <div>
                User
            </div>
        )
    }
}
export default EventUser;