import React, { Component } from 'react'
import { Dialog, ListItem } from 'material-ui';
import AppointmentModifier from "./AppointmentModifier"

export default class AppointmentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appoModOpen:false
        };    
    }

    openEdit = () => {
        this.setState({appoModOpen:true})
    }

    closeEdit = () => {
        this.setState({appoModOpen:false})
    }

    render() {
        let appo = this.props.appointment
        return (
            <div>
            <ListItem key={appo.aid} onClick={() => this.openEdit()}>
                <h3>{appo.description}</h3>
                <h5>{appo.patient.firstname} {appo.patient.lastname}</h5>
                <p>{this.convertTime(appo.startdate)}</p>
            </ListItem>
            <AppointmentModifier 
                open={this.state.appoModOpen}
                create={false} 
                appointment={appo}
                close={this.closeEdit}
                
            />
            </div>
        )
  }

  dialog(){

  }

  convertTime(dateString) {
    let day,month,year,hour,minute;
    
    year = dateString.slice(0,4);
    month = dateString.slice(5,7);
    day = dateString.slice(8,10);
    hour = dateString.slice(11,13);
    minute = dateString.slice(14,16);
    
    return day + "." + month + "." + year + " " + hour + ":" + minute;
  }
}
