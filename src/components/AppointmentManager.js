import React, { Component } from 'react'
import { List, ListItem, CircularProgress, RaisedButton, Checkbox } from 'material-ui';
import AppointmentCard from "./AppointmentCard"
import PatientSelector from "./PatientSelector"
import AppointmentModifier from "./AppointmentModifier"
import ErrorDialog from "./ErrorDialog"

const bodyStyle = {
    display : "flex",
    flex : "row"
}

export default class AppointmentManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            appoCreateOpen:false,
            disableCreate:true,
            showPassed:false,
            error:false,
            errorMessage:"",
            patid:0,
            episodeid:0,
            appointments : []
        };    
    }

    token = localStorage.getItem("token");

    componentWillMount() {
        this.loadAppointments()
    }

    //Gets all appointments of a practitioner and saves them in the state
    loadAppointments = () => { 
            fetch('http://patientpath.i4mi.bfh.ch:1234/appointment/full', {
                    headers: {
                        'token': this.token 
                    }
                }).then(res => res.json())
                .then((appo) => {
                    this.setState({appointments : appo, loaded : true});
                }).catch(reason => this.setState({error:true,errorMessage:"Es kann keine Verbindung zum Server hergestellt werden."}))
                   
    }
    
    //is triggered from children when a change is done to an appointment
    //reloads the whole appointmentlist
    reload = () => {
        console.log("called")
        this.setState({loaded : false})
        this.loadAppointments()
    }

    //Is called when the errorDialog is closed
    closeError = () => {
        this.setState({error:false,errorMessage:""})
    }

    //Changes the state property showPassed
    //When this property is set to true appointments that lie in the past are also shown
    showPassed = () => {
        let invert = !this.state.showPassed
        this.setState({showPassed:invert})
    }

    //sets the patientid of the selected Patient in the PatientSelector
    //If a patient is selected an appointemnt can be created thorugh a click on the create button
    setPat = (patid) => {
        let disableCreate=true
        if(patid!=0){
            disableCreate=false
        }
        this.setState({"patid":patid, "disableCreate":disableCreate})
    }
    
    openAppoCreate = () => {
        this.setState({appoCreateOpen:true})
    }

    closeAppoCreate = () => {
        this.setState({appoCreateOpen:false})
        this.reload()
    }

    loaded(){
        let apposFiltered = this.state.appointments
        //Filter out canceled appointments
        apposFiltered = apposFiltered.filter(appo => appo.canceled != true) 
    
        if(this.state.showPassed==false){
            //Appoitments that lie in the past will be removed from the array
            //Excepte those appointment which have a pending changerequest 
            apposFiltered = apposFiltered.filter(appo => {
                let show =false
                if(new Date(appo.startdate) > new Date()){
                    show=true
                } 
                if (appo.changerequest==true){
                    show=true
                }
                return show
            })
        }
        if(this.state.patid != 0) {
            apposFiltered = apposFiltered.filter(appo => appo.patient.patid == this.state.patid)
        } 
        let appoList = apposFiltered.map((appo) => {
            return (
                <AppointmentCard update={this.reload} appointment={appo} create={false} key={appo.aid} />
            )
        })
        let newAppo = {}
        newAppo.startdate = new Date()
        
        return (
            <div style={bodyStyle}>
                <div className="selectors">
                    <PatientSelector 
                    setPat={this.setPat} 
                    selectedPatId={this.state.patid}
                    />
                </div>
                <div className="appointments">
                    <RaisedButton 
                        label="Termin erstellen" 
                        onClick={() => this.openAppoCreate()}
                        disabled={this.state.disableCreate}
                    />
                    <Checkbox 
                        label="Vergangene Termine anzeigen" 
                        checked={this.state.showPassed}
                        onClick={() => this.showPassed()}
                    />
                    <List>
                        {appoList}
                    </List>
                </div>
                <AppointmentModifier 
                    appointment={newAppo} 
                    create={true} open={this.state.appoCreateOpen}
                    close={() => this.closeAppoCreate()}
                    patid = {this.state.patid}
                    instid = {this.props.instid}
                />
                <ErrorDialog 
                    open={this.state.error}
                    close={this.closeError}
                    message={this.state.errorMessage}
                />
            </div>
        )
    }
    
    checkLoaded(){
        if(this.state.loaded == true){
            return this.loaded()
        } else {
            return <p>Loading...</p>
            
        }
    }

    render() {
        return (
            <div>
                {this.checkLoaded()}
            </div>
        )
    }

}
