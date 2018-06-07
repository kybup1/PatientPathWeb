import React, { Component } from 'react'
import { Dialog, ListItem, IconButton, ActionAssignment } from 'material-ui';
import ActionAssignmentTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import AppointmentModifier from "./AppointmentModifier"
import ChecklistModifier from "./ChecklistModifier"

export default class AppointmentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appoEditOpen:false,
            checklistEditOpen:false
        };    
    }

    token = localStorage.getItem("token");

    openAppoEdit = () => {
        this.setState({appoEditOpen:true})
    }

    closeAppoEdit = () => {
        this.setState({appoEditOpen:false})
        this.props.update()
    }

    openChecklistEdit = () => {
        if (this.props.appointment.checklist==null){
            let checklist = {}
            checklist.aid = this.props.appointment.aid
            checklist.name = this.props.appointment.name
            fetch('http://patientpath.i4mi.bfh.ch:1234/checklist', {
                method:"POST",    
                headers: {
                    "Content-Type" : "application/json",
                    'token': this.token
                },
                body:JSON.stringify(checklist)
            }).then(res => res.json())
            .then((checklist) => this.props.update())
            .catch(reason => console.log(reason))
        }
        this.setState({checklistEditOpen:true})
    }

    closeChecklistEdit = () => {
        this.setState({checklistEditOpen:false})
        this.props.update()
    }

    setchecklistColor = () => {
        if(this.props.appointment.checklist==null){
            return "#a0a0a0"
        } else {
            return "black"
        }
    }

    setAppoStyle = () => {
        if(new Date(this.props.appointment.startdate) < new Date()){
            return {color:"grey"}
        } else {
            return {color:"black"}
        }
    }

    setChecklistTooltip = () => {
        if(this.props.appointment.checklist==null){
            return "Checkliste hinzufügen"
        } else {
            return "Checkliste bearbeiten"
        }
    }

    checklistButton = (
        <IconButton
          touch={true}
          tooltip={this.setChecklistTooltip()}
          tooltipPosition="bottom-left"
          onClick={() => {this.openChecklistEdit()}}
        >
          <ActionAssignmentTurnedIn color={this.setchecklistColor()} />
        </IconButton>
    )

    render() {
        let appo = this.props.appointment
        return (
            <div>
            <ListItem  
            key={appo.aid} 
            onClick={() => this.openAppoEdit()}
            rightIconButton={this.checklistButton}
            style={this.setAppoStyle()}
            >
                <h3>{appo.name}</h3>
                <h5>{appo.patient.firstname} {appo.patient.lastname}</h5>
                <p>{this.convertTime(appo.startdate)}</p>
            </ListItem>
            <AppointmentModifier 
                open={this.state.appoEditOpen}
                create={false} 
                appointment={appo}
                close={this.closeAppoEdit}
            />

            <ChecklistModifier
                open={this.state.checklistEditOpen}
                aid={appo.aid}
                checklist={appo.checklist}
                close={this.closeChecklistEdit}
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
