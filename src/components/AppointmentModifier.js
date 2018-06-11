import React, { Component } from 'react'
import { Dialog, TextField, RaisedButton, DatePicker, TimePicker } from 'material-ui';
import ErrorDialog from "./ErrorDialog"

export default class AppointmentModifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "appo":this.props.appointment,
            "duration":0,
            error:false,
            errorMessage:""
        };    
    }

    token = localStorage.getItem("token")

    //is called when a value of an input field is changed
    appoChange = (e) => {
        let appo = this.state.appo;
        appo[e.target.name] = e.target.value;
        this.setState({
          "appo": appo ,
        });
    }

    //Is called when the errorDialog is closed
    closeError = () => {
        this.setState({error:false,errorMessage:""})
    }

    //sets the startdate of an appointment
    startDateChange = (e, date) => {
        //a workaround for the fact that the tostring method of a JS Date object 
        //allways converts the time to the local timezone.
        date.setHours(date.getHours()-(date.getTimezoneOffset()/60))
        let appo = this.state.appo
        appo.startdate=date.toISOString()
        appo.modified=true
        this.setState({"appo":appo})
    }

    //calculates the enddate property of an appointment depending on the duration that is set
    calculateEndDate = () => {
        let startd = new Date(this.state.appo.startdate)
        let duration = this.state.duration
        let endd =new Date(
            startd.setMinutes(startd.getMinutes()+duration)
        )
        return endd.toISOString()
    }

    //saves the appointment to the server
    persist = () => {
        let appo = this.state.appo
        let duration = this.state.duration
        //A new object is created since the fetched object contains also linked information
        //such as patientdata in an array. This can not be send to the server in this format.
        let appoSave = {}
        appoSave.aid = appo.aid;
        appoSave.name = appo.name;
        appoSave.description = appo.description;
        appoSave.startdate = appo.startdate;
        appoSave.enddate = appo.enddate;
        appoSave.modified = appo.modified;
        //After a change the flag for the changerequest will be reset
        appoSave.changerequest = false;
        //sets the patid depending if a new appointment is created or not
        if(this.props.create == false){
            appoSave.patid = appo.patient.patid;
        } else {
            appoSave.patid = this.props.patid
            appoSave.instid = this.props.instid
        }
        if(duration == 0 || duration == null){
            this.setState({error:true,errorMessage:"Bitte geben sie die Dauer des Termins an"})
            return
        } else {
            appoSave.enddate = this.calculateEndDate();
        }

        //depending if a new appointment is created or not a POST or PUT request will be send
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

    cancel = () => {
        console.log("canceled")
        fetch("http://patientpath.i4mi.bfh.ch:1234/appointment/"+this.state.appo.aid, {
                method:"PUT",
                headers: {
                    "Content-Type" : "application/json",
                    "token":this.token, 
                },
                body: {
                    "patid":this.state.appo.patient.patid,
                    "canceled":true
                }
            }).then(res => this.props.close())
            .catch(err => console.log(err))
    }

    initDateTimePicker = () => {
        let startd = new Date(this.state.appo.startdate);
        startd.setHours(startd.getHours()+(startd.getTimezoneOffset()/60))
        return (
            <div>
            <DatePicker
                autoOk={true}
                cancelLabel="Abbrechen"
                floatingLabelText="Datum"
                value={startd}
                onChange={(e, date) => {this.startDateChange(e, date)}}
            />
            <TimePicker
                autoOk={true}
                cancelLabel="Abbrechen"
                floatingLabelText="Zeit"
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
            /> <br/>
            <TextField 
                name="description"
                multiLine={true}
                floatingLabelText="Beschreibung"
                value={this.state.appo.description}
                onChange = {(e) => this.appoChange(e)}
            /> <br/>
            
            <RaisedButton 
                label = "Speichern"
                onClick={() => this.persist()}
                labelColor = '#fff'
                backgroundColor = '#1c313a' 
            />

            <RaisedButton style={styles.button}
                label = "Termin stornieren"
                onClick={() => this.cancel()}
                labelColor = '#fff'
                backgroundColor = '#1c313a' 
            />
            
            <RaisedButton style={styles.button}
                label = "Abbrechen"
                onClick={() => this.props.close()}
                labelColor = '#fff'
                backgroundColor = '#1c313a' 
            />
            <ErrorDialog 
                open={this.state.error}
                close={this.closeError}
                message={this.state.errorMessage}
            />
         </Dialog>
        )
    }
}

let styles = {
    button: {
        marginLeft: 5,
    }
};
