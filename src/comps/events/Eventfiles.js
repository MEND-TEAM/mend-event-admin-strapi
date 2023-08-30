import { Icon, Layout, Menu, Dropdown } from 'antd';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Eventfiles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            eventfiles: []
        }
    }

    async componentDidMount (){
        let response= await fetch("http://192.168.0.20:1337/Eventfiles")
        if(!response.ok){
            return
        }

        let eventfiles = await response.json()
        this.setState({loading: false, eventfiles: eventfiles})
    }

    render(){
        if(!this.state.loading){
            return(
                <div className="eventsList">
                    Available events ({this.state.eventfiles.length})
                    <div className="classZarlajUguh">
                        {this.state.events.map((eventfile,i) =>{
                            return(
                                <div className="classZarlajUguh" key={i}>
                                <Link to={`/event/${eventfile.id}`}>
                                    <h3>{eventfile.name}</h3>
                                    <img src={`http://192.168.0.20:1337/Eventfile`} alt={eventfile.name} />
                                </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )
        }
    }
}
export default Eventfiles;