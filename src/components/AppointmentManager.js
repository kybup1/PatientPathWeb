import React, { Component } from 'react'
import { List, ListItem, CircularProgress } from 'material-ui';
import AppointmentCard from "./AppointmentCard"

export default class AppointmentManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            patid:null,
            episodeid:null,
            appointments : []
        };    
    }

    token = localStorage.getItem("token");

    componentWillMount() {
        if(this.state.loaded == false){
            fetch('http://patientpath.i4mi.bfh.ch:1234/appointment/full', {
                    headers: {
                        'token': this.token 
                    }
                }).then(res => res.json())
                .then((appo) => {
                    this.setState({appointments : appo, loaded : true});
                }).catch(reason => console.log(reason))
        }           
    }

    loadAppointment = () => {
        if(this.state.loaded == false){
            fetch('http://patientpath.i4mi.bfh.ch:1234/appointment', {
                    headers: {
                        'token': this.token 
                    }
                }).then(res => res.json())
                .then((appo) => {
                    this.setState({appointments : appo, loaded : true});
                }).catch(reason => console.log(reason))
        } 
    }
    

    loaded(){
        let appoList = this.state.appointments.map((appo) => {
            return (
                <AppointmentCard appointment={appo} create={false} key={appo.aid} />
            )
        })
        console.log(appoList)
        return (
            <div>
                <div className="appointments">
                    <List>
                        {appoList}
                    </List>
                </div>
            </div>
        )
    }
    
    checkLoaded(){
        if(this.state.loaded == true){
            return this.loaded()
        } else {
            return <p>Loading...</p>
            this.loadAppointment()
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
