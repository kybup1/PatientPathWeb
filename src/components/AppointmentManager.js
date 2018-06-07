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
            erro:false,
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
    
    reload = () => {
        this.setState({loaded : false})
        this.loadAppointments()
    }

    closeError = () => {
        this.setState({error:false,errorMessage:""})
    }

    showPassed = () => {
        let invert = !this.state.showPassed
        this.setState({showPassed:invert})
    }

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
        if(this.state.showPassed==false){
            apposFiltered = apposFiltered.filter(appo => new Date(appo.startdate) > new Date())
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
                    <PatientSelector setPat={this.setPat} />
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
