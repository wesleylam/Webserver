import React, { Component } from 'react';
import './style/Editor.css';

class EditorRow extends Component {
    constructor(props) {
        super(props);
        
        // enable the use of this in functions
        this.clear = this.clear.bind(this);

        // create states of each column (field) values
        let tempState = {};
        for (let i in this.props.columns){
            // set field to either empty or the existing value
            let c = this.props.columns[i];
            tempState[c] = (this.props.mode === "Create") ? "" : this.props.fieldValue[c]
        }
        // copy tempstate to state
        this.state = JSON.parse(JSON.stringify(tempState));
    }

    // can only be called when creating rows
    clear(){
        // reset all field to empty string
        let tempState = {};
        for (let i in this.props.columns){
            let c = this.props.columns[i];
            tempState[c] = ""
        }
        this.setState(tempState)
    }

    // render 
    render(){        
        return <div className="entryDivs">
            {[...this.props.columns].map( (k, i) => { 
                return <div className="entryDiv"> {k}: &nbsp;
                    {   
                        // no edit if: ID while editing or Deleting
                        (this.props.mode === "Delete" || ((k === "ID") && (this.props.mode === "Edit"))) 
                        ?
                        // display only
                        <b>{this.state[k]}</b>
                        :
                        // text input field
                        <input onChange={e => {this.setState({ [k]: e.target.value })}} value={this.state[k]}/> 
                    }
                </div>
            })}

            {/* submit / clear / cancel button  */}
            <button id="submit" onClick={() => this.props.submitHandler(this.state)}>{this.props.mode}</button>
            { this.props.mode === "Create" ? 
                <button onClick={this.clear}>Clear</button> : null
            }
            <button onClick={this.props.closeHandler}>Cancel</button>
        </div>
    }
}

export default EditorRow;