import React, { Component, Modal} from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from "material-ui/Dialog";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:null,
            password:null
        };    
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }

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
                <Dialog />
           }
       })
       
    }



  render() {
    return (
      <div>
        <div className="loginwindow">
            <h1>Login</h1>
            <div className="loginForm">   
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
                <RaisedButton 
                    label = "Login"
                    onClick={() => this.loginHandler()} 
                />
            </div>
        </div>
      </div>
    )
  }
}

