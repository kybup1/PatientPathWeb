import React, { Component } from 'react'
import { Dialog, TextField, RaisedButton, ListItem, List, IconButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';


export default class ChecklistModifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
        "aid":this.props.aid,
        "checklist":this.props.checklist,
        open:this.props.open
    };    
}

token = localStorage.getItem("token")
newItem = {}

componentWillUpdate(){
  let id
  try {id = this.state.checklist.chklstid}
  catch(err) {id = 0}
  fetch("http://patientpath.i4mi.bfh.ch:1234/checklist/" + id, {
    method : "GET",
    headers : {
      "token" : this.token
    }
  }).then(res => res.json())
  .then(checklist => {
    this.setState({"checklist": checklist})
  })
}

deleteChecklist = () => {
  fetch("http://patientpath.i4mi.bfh.ch:1234/checklist/"+this.state.checklist.chklstid, {
                method:"DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "token":this.token, 
                },
            }).then (this.props.close())
}

addItem = () => {
  if(this.newItem == "" || this.newItem == null){
    //error dialog
  } else {
      let id = this.state.checklist.chklstid
      fetch("http://patientpath.i4mi.bfh.ch:1234/checklist/" + id + "/additem", {
        method:"POST",
        headers: {
          "Content-Type" : "application/json",
          "token":this.token 
        }, 
        body : JSON.stringify(this.newItem)
      }).then(res => {
        this.newItem.name = ""  
        this.forceUpdate()
      })
      .catch((error) => console.log(error))
    }
    
  }

  deleteItem = (itemId) => {
    console.log(itemId)
    fetch("http://patientpath.i4mi.bfh.ch:1234/checklist/removeitem/"+itemId, {
      method:"DELETE",
      headers: {
          "Content-Type" : "application/json",
          "token":this.token, 
      },
  }).then(res => this.forceUpdate())
  .catch((error) => console.log(error))
  
}  
  


drawChecklist = () => {
  if(this.state.checklist){
    try{
      let checkListItems = this.state.checklist.checklistitems.map((item) => {
        return (
          <ListItem 
            key={item.chklstitemid}
            rightIconButton = 
            {<IconButton onClick={() => this.deleteItem(item.chklstitemid)}>
              <ActionDelete></ActionDelete>
            </IconButton>}
            primaryText={item.name}
          >
          </ListItem>
        )
      })
      return checkListItems
    } catch(err) {
      return (<ListItem><p>Checkliste ist leer</p></ListItem>)
    } 
} else {
  return <p>no Checklist</p>
}
}

  render() {
    return (
      <Dialog open={this.props.open}
      onRequestClose={() => this.props.close()} 
      >
        <List>
          {this.drawChecklist()}
        </List>
        <div>
        <TextField 
          style={styles.input}
          name="nameEintrag"
          floatingLabelText="Name des Eintrages"
          value={this.newItem.name}
          onChange={(e) => {this.newItem.name = e.target.value}}
        /> </div><br/>

        <RaisedButton 
          label="Eintrag hinzufügen"
          labelColor = '#fff'
          backgroundColor = '#1c313a' 
          onClick ={() => this.addItem()}  
        />

        <RaisedButton style={styles.button}
          label = "Abbrechen"
          labelColor = '#fff'
          backgroundColor = '#1c313a' 
          onClick={() => this.props.close()} 
        />

        <RaisedButton style={styles.button}
          label = "Checkliste entfernen"
          labelColor = '#fff'
          backgroundColor = '#1c313a' 
          onClick={() => this.deleteChecklist()} 
        />

      </Dialog>
    )
  }
}

let styles = {
  button: {
      marginLeft: 5,
  },
  input: {
    margin: 0,
  }
};