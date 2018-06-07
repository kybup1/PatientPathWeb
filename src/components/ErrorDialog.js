import React, { Component } from 'react'
import { Dialog, RaisedButton } from 'material-ui';

export default class ErrorDialog extends Component {
    render() {
        return (
            <Dialog 
                open={this.props.open}
                onClose={() => this.props.close()}
                title="Fehler"
            >        
                <p>{this.props.message}</p>
                <RaisedButton label="ok" onClick={() => this.props.close()} />
            </Dialog>
        )
    }
}
