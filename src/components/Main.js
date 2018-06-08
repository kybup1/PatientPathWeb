import React, { Component } from 'react';
import Tabs from "material-ui/Tabs/Tabs";
import Tab from "material-ui/Tabs/Tab";
import { RaisedButton } from 'material-ui';
import AppointmentManager from "./AppointmentManager";
import ErrorDialog from "./ErrorDialog"


export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            practitioner:null,
            loaded:false,
            error:false,
            errorMessage:""
        };    
    }

    componentWillMount(){
        this.updatePracticioner()
    }

    componentWillUpdate(){
        this.updatePracticioner()
    }

    //loads the practitioner and sets the state to loaded if successfully
    updatePracticioner = () => {
        let token = localStorage.getItem("token");
        
        if (this.state.loaded == false){
            fetch('http://patientpath.i4mi.bfh.ch:1234/practitioner', {
                headers: {
                    'token': token 
                  }
            }).then(res => res.json())
            .then((pract) => {
                this.setState({loaded : true, practitioner : pract});
            }).catch(reason => this.setState({error:true,errorMessage:"Es kann keine Verbindung zum Server hergestellt werden."}))
            
        }
    }

    //Is called when the ErrorDialog is has to be closed
    closeError = () => {
        this.setState({error:false,errorMessage:""})
    }

    //The content that will be rendered if the state property loaded is set to true
    //This is rendered when the practitioner is loaded successfully
    loaded = () => {
        return (
            <div className = "main">
                <div className = "header">
                    <div className = "title">
                        <h1>PatientPath</h1>
                    </div>
                    <div className = "user">
                        <p>Eingeloggt als: {this.state.practitioner.firstname} {this.state.practitioner.lastname} </p>
                
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

    //Is rendered when the state property loaded is set to false
    notLoaded = () => {
        return (
            <h1>loading...</h1>
        )
    }

    //This method is called when the logout button is pressed and triggers the parent logout method
    logout () {
        this.setState({loaded : false});
        this.props.logout()
    }

    render() {

        //Here the state property loaded is checked and the corresponding content will be rendered
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
                <ErrorDialog 
                    open={this.state.error}
                    close={this.closeError}
                    message={this.state.errorMessage}
                />
            </div>
        )
    }
}
