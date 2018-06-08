import React, { Component } from 'react';
import './App.css';
import Login from './components/login';
import Main from './components/Main';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { DeviceSignalCellularNull } from 'material-ui';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        token : null,
        loggedIn:  false
    };    
}

//This mehtod is called when the login is successfully
//The token is saved into localStorage
saveToken = (token) => {
  this.setState({
    token : token,
    loggedIn:true
  })
  localStorage.setItem("token", token);
}

//this method is called when the logout button is pressed
//The token is removed from the localStorage
logout = () => {
  localStorage.removeItem("token");
  this.setState({
    token:null,
    loggedIn:false
  })
}

componentWillMount() {
  if(localStorage.getItem("token")){
    this.setState({
      token: localStorage.getItem("token"),
      loggedIn : true
    })
  } 
}

  render() {

    //Checks if a practitioner is logged in and returns the coresponding content
    let authenticate = () => {
      if(this.state.loggedIn == false){
        return <Login saveToken={this.saveToken} />
      } else {
        return <Main logout={this.logout} loaded={false} />
      }
    }

    return (
      <MuiThemeProvider>
      <div className="App">
        {authenticate()}
      </div>
      </MuiThemeProvider>
    );
  }
}



export default App;
