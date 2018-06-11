import React, { Component, Modal} from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from "material-ui/Dialog";
import ErrorDialog from "./ErrorDialog";
import logo from '../img/pathapp.png'; 

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:null,
            password:null,
            error:false,
            errorMessage:"",
        };    
    }

    //Updates the state when a input is changed
    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
    }

    //Is called when the ErrorDialog is closed
    closeError = () => {
        this.setState({error:false,errorMessage:""})
    }

    //Is called when the login button is pressed
    //Sends the POST request with the logindata to the server and updates the state if the login is successfully
    loginHandler = (e) => {
        fetch('http://patientpath.i4mi.bfh.ch:1234/login/practitioner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        }).then(resp => resp.json())
       .then(data => {
           if(data.token){
               this.props.saveToken(data.token)
           } else {
                this.setState({error:true,errorMessage:"Benutzername oder Passwort falsch"})
           }
       }) .catch(err => this.setState({error:true,errorMessage:"Ein unbekannter Fehler ist aufgetreten"}))
       
    }



  render() {
    return (
      <div>
        <div className="loginWindow">
            <div className="loginForm">   
                <img style={styles.icon} src={logo} alt="pathappicon"/>
                <h3>Willkommen beim WebInterface für PatientPath</h3>
                <TextField
                    floatingLabelText = "Benutzername: "
                    name = "username"
                    onChange = {(e) => this.onChange(e)}
                />
                <br/>
                <TextField
                    type = "password"
                    floatingLabelText = "Passwort: "
                    name = "password"
                    onChange = {(e) => this.onChange(e)}
                />
                <br/>
                <RaisedButton style={styles.button}
                    label = "Login"
                    labelColor = '#fff'
                    backgroundColor = '#1c313a'
                    onClick={() => this.loginHandler()} 
                />
                <ErrorDialog 
                    open={this.state.error}
                    close={this.closeError}
                    message={this.state.errorMessage}
                />
            </div>
        </div>
      </div>
    )
  }
}

let styles = {
    container: {
      flex: 1,
    },
    picContainer : {
        flexGrow: 1,
        justifyContent:'flex-end',
        alignItems: 'center',
    },
    content : {
        flex: 1,
    },
    button: {
        width:260,
        margin: 20,
    },
    icon: {
        width: 48,
        height: 48,
        marginTop: 20,
    }
  }
