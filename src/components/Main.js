import React, { Component } from 'react';
import Tabs from "material-ui/Tabs/Tabs";
import Tab from "material-ui/Tabs/Tab";
import { RaisedButton } from 'material-ui';
import AppointmentManager from "./AppointmentManager"


export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            practitioner:null,
            loaded:false
        };    
    }

    componentWillMount(){
        let token = localStorage.getItem("token");
        
        if (this.state.loaded == false){
            fetch('http://patientpath.i4mi.bfh.ch:1234/practitioner', {
                headers: {
                    'token': token 
                  }
            }).then(res => res.json())
            .then((pract) => {
                this.setState({loaded : true, practitioner : pract});
            }).catch(reason => console.log(reason))
            
        }
    }

    loaded = () => {
        return (
            <div className = "main">
                <div className = "header">
                    <div className = "title">
                        <h1>PatientPath</h1>
                    </div>
                    <div className = "user">
                        <p>Logged in as: {this.state.practitioner.firstname} {this.state.practitioner.lastname} </p>
                
                        <RaisedButton 
                        label = "Log out"
                        onClick = {() => this.logout()}
                        />
                    </div>
                </div>
                <div className="tabBar">
                    <Tabs>
                        <Tab label="Termine">
                            <AppointmentManager />
                        </Tab>
                        <Tab label="Profil">

                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }

    notLoaded = () => {
        return (
            <h1>loading...</h1>
        )
    }

    logout () {
        this.setState({loaded : false});
        this.props.logout()
    }

    render() {

        let checkLoaded = () => {
            if (this.state.loaded == false){
                return this.notLoaded()
            } else {
                return this.loaded()
            }
        }

        return (
            <div>
            {checkLoaded()}
            </div>
        )
    }
}
