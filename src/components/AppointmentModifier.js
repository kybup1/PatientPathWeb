import React, { Component } from 'react'
import { Dialog, TextField, DatePicker, TimePicker, RaisedButton } from 'material-ui';

export default class AppointmentModifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "appo":this.props.appointment
        };    
    }

    token = localStorage.getItem("token")


    appoChange = (e, date) => {
        let appo = this.state.appo;
        appo[e.target.name] = e.target.value;
        this.setState({
          "appo": appo ,
        });
    }

    startDateChange = (date) => {
        date.setHours(date.getHours()-(date.getTimezoneOffset()/60))
        let appo = this.state.appo
        appo.startdate=date.toISOString()
        appo.modified=true
        this.setState({"appo":appo})
    }
    appoEndDateChange = (date) => {
        date.setHours(date.getHours()-(date.getTimezoneOffset()/60))
        let appo = this.state.appo
        appo.enddate=date.toISOString()
        appo.modified=true;
        this.setState({"appo":appo})
    }

    persist = () => {
        let appo = this.state.appo
        let appoSave = {}
        appoSave.aid = appo.aid;
        appoSave.patid = appo.patient.patid;
        appoSave.name = appo.name;
        appoSave.description = appo.description;
        appoSave.startdate = appo.startdate;
        appoSave.enddate = appo.enddate;

        console.log(JSON.stringify(appoSave))

        if(this.props.create == false){
            fetch("http://patientpath.i4mi.bfh.ch:1234/appointment/"+appoSave.aid, {
                method:"PUT",
                headers: {
                    "Content-Type" : "application/json",
                    "token":this.token, 
                },
            }).then(res => this.props.close())
            .catch(err => console.log(err))
        }
    }

    initDateTimePicker = () => {
        let startd = new Date(this.state.appo.startdate);
        startd.setHours(startd.getHours()+(startd.getTimezoneOffset()/60))
        let endd = new Date(this.state.appo.enddate);
        endd.setHours(endd.getHours()+(endd.getTimezoneOffset()/60))
        return (
            <div>
            <DatePicker name="startd" onChange={(e,date) => this.startDateChange(date)} value = {startd}/>
            <TimePicker name="startt" onChange={(e, date) => this.startDateChange(date)} format="24hr" value = {startd}/>
            <DatePicker name="endd" value = {endd}/>
            <TimePicker name="endt" format="24hr" value = {endd}/>
            </div>
        )
    }

    render() {
        return (
            <Dialog open={this.props.open}
        >
            <TextField 
                name="name"
                floatingLabelText="Titel"
                value={this.state.appo.name}
                onChange = {(e) => this.appoChange(e)}
            />
            <TextField 
                name="description"
                multiLine={true}
                floatingLabelText="Beschreibung"
                value={this.state.appo.description}
                onChange = {(e) => this.appoChange(e)}
            />
            {this.initDateTimePicker()}
            <RaisedButton 
                label = "Speichern"
                onClick={() => this.persist()} 
            />
            
            <RaisedButton 
                label = "Abbrechen"
                onClick={() => this.props.close()} 
            />
         </Dialog>
        )
    }
}
