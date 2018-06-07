import React, { Component } from 'react'
import { Dialog, TextField, RaisedButton, DatePicker, TimePicker } from 'material-ui';

export default class AppointmentModifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "appo":this.props.appointment,
            "duration":0
        };    
    }

    token = localStorage.getItem("token")


    appoChange = (e) => {
        let appo = this.state.appo;
        appo[e.target.name] = e.target.value;
        this.setState({
          "appo": appo ,
        });
    }

    startDateChange = (e, date) => {
        date.setHours(date.getHours()-(date.getTimezoneOffset()/60))
        let appo = this.state.appo
        appo.startdate=date.toISOString()
        appo.modified=true
        this.setState({"appo":appo})
    }

    calculateEndDate = () => {
        let startd = new Date(this.state.appo.startdate)
        let duration = this.state.duration
        let endd =new Date(
            startd.setMinutes(startd.getMinutes()+duration)
        )
        return endd.toISOString()
    }

    persist = () => {
        let appo = this.state.appo
        let duration = this.state.duration
        let appoSave = {}
        appoSave.aid = appo.aid;
        appoSave.name = appo.name;
        appoSave.description = appo.description;
        appoSave.startdate = appo.startdate;
        appoSave.enddate = appo.enddate;
        appoSave.modified = appo.modified;
        if(this.props.create == false){
            appoSave.patid = appo.patient.patid;
        } else {
            appoSave.patid = this.props.patid
        }
        if(duration == 0 | duration == null){
            appoSave.enddate=""
        } else {
            appoSave.enddate = this.calculateEndDate();
        }

        console.log(JSON.stringify(appoSave))

        if(this.props.create == false){
            fetch("http://patientpath.i4mi.bfh.ch:1234/appointment/"+appoSave.aid, {
                method:"PUT",
                headers: {
                    "Content-Type" : "application/json",
                    "token":this.token, 
                },
                body: JSON.stringify(appoSave)
            }).then(res => this.props.close())
            .catch(err => console.log(err))
        } else {
            fetch("http://patientpath.i4mi.bfh.ch:1234/appointment/", {
                method:"POST",
                headers: {
                    "Content-Type" : "application/json",
                    "token":this.token, 
                },
                body: JSON.stringify(appoSave)
            }).then(res => this.props.close())
            .catch(err => console.log(err))
        }
    }

    initDateTimePicker = () => {
        let startd = new Date(this.state.appo.startdate);
        startd.setHours(startd.getHours()+(startd.getTimezoneOffset()/60))
        return (
            <div>
            <DatePicker
                autoOk={true}
                cancelLabel="Abbrechen"
                value={startd}
                onChange={(e, date) => {this.startDateChange(e, date)}}
            />
            <TimePicker
                autoOk={true}
                cancelLabel="Abbrechen"

                name="startd"
                value={startd}
                format="24hr"
                onChange={(e, date) => {this.startDateChange(e, date)}}
            />
            <TextField 
                key="duration"
                name="duration"
                floatingLabelText="Dauer"
                value={this.state.duration}
                type="number"
                onChange={(e) => this.setState({"duration":e.target.value})}
                />
                <text>min</text>
            </div>
        )
    }

    render() {
        return (
            <Dialog open={this.props.open}>   
            {this.initDateTimePicker()}
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
