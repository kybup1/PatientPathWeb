import React, { Component } from 'react';
import Tabs from "material-ui/Tabs/Tabs";
import Tab from "material-ui/Tabs/Tab";
import { RaisedButton } from 'material-ui';


export default class Main extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div>
        <div className = "header">
            <div className = "title">
                <h1>PatientPath</h1>
            </div>
            <div className = "user">
                <p>Logged in as: </p>
                
                <RaisedButton 
                label = "Log out"
                onClick = {() => this.props.logout()}
                />
            </div>
        </div>
        <div className="tabBar">
            <Tabs>
                <Tab label="Termine">

                </Tab>
                <Tab label="Profil">

                </Tab>
            </Tabs>
        </div>
      </div>
    )
  }
}
