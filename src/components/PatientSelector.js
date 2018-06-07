import React, { Component } from 'react'
import { TextField, ListItem, List } from 'material-ui';

export default class PatientSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm : ""
        };    
    }

    token = localStorage.getItem("token")
    patients = []
    patsFiltered = []
    patsFiltered = []

    componentWillMount(){
        fetch("http://patientpath.i4mi.bfh.ch:1234/patient/all", {
            method : "GET",
            headers : {
                "token" : this.token
            }
        }).then(res => res.json())
        .then(patients => {
                this.patients = patients
                this.patsFiltered = patients
                this.forceUpdate()
        })
    }

    componentWillUpdate(nextProps, nextState){
        this.filterPats(nextState.searchTerm)
    }

    filterPats = (searchterm) => {
        this.patsFiltered = this.patients.filter(pat => 
            pat.firstname.toLowerCase().includes(searchterm.toLowerCase()) || 
            pat.lastname.toLowerCase().includes(searchterm.toLowerCase()))        
        
    }

    resetSelection = () => {
        this.setState({searchTerm:""})
        this.props.setPat(0)
    }

    render() {

        let patList = this.patsFiltered.map(pat => {
            return (
                <ListItem
                key={pat.patid}
                onClick={() => this.props.setPat(pat.patid)}
                >
                    <p>{pat.firstname} {pat.lastname}</p>
                </ListItem>
            )
        })

        return (
            <div>
                <p>Patient wählen: </p>
                <TextField
                floatingLabelText="Suchen"
                onChange={(e) => this.setState({searchTerm:e.target.value})}
                value={this.state.searchTerm}
                />
                <List>
                    <ListItem
                    key={0}
                    onClick={() => this.resetSelection()}
                    >
                    Alle
                    </ListItem>
                    {patList}
                </List>
            </div>
        )
    }
}
