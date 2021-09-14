import React, { Component } from 'react';
import './style/Editor.css';

const fieldTypes = ["integer", "bigInteger", "text", "string", "float", "decimal", "boolean", "date", "datetime", "time", "timestamp"];
const defaultNewName = ""
const defaultNewType = "integer"

function convertType(type){
    switch (type) {
        case "varchar":
            return "text";
    
        default:
            return type;
    }
}

class EditorTable extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props)
        
        // enable the use of this in functions
        this.changeField = this.changeField.bind(this);
        this.changeNewFieldName = this.changeNewFieldName.bind(this);
        this.changeNewFieldType = this.changeNewFieldType.bind(this);
        this.addField = this.addField.bind(this);
        this.reset = this.reset.bind(this);
        // this.postLoadingUpdate = this.postLoadingUpdate.bind(this);

        let tempState = {
            newField: {name: defaultNewName, type: defaultNewType},
        };

        if (props.mode === "Create"){ // Create
            tempState.oldFields = JSON.parse(JSON.stringify(props.fieldValue));
            tempState.fields = props.fieldValue;
            tempState.tableName = "";

        } else { // Edit / Drop
            tempState.tableName = this.props.tableName;

            // parse columninfo into fields
            let i = 0, temp = {};
            for ( let k in props.columnInfo ){
                temp[i] = {name: k, type: convertType(props.columnInfo[k].type)}
                i++;
            }
            tempState.oldFields = JSON.parse(JSON.stringify(temp));
            tempState.fields = JSON.parse(JSON.stringify(temp));
        }

        this.state = JSON.parse(JSON.stringify(tempState));
    }


    // change a field detail by modifing the inputs
    changeField(i, name, type){
        let temp = this.state.fields;
        temp[i].name = name;
        temp[i].type = type;
        this.setState({ fields: temp });
    }

    // state for the name input of new adding field
    changeNewFieldName(newName){
        this.setState({ newField: {name: newName, type: this.state.newField.type} });
    }
    // state for the type input of new adding field
    changeNewFieldType(newType){
        this.setState({ newField: {name: this.state.newField.name, type: newType} });
    }

    // action handler when submitting a new field (ADD button)
    addField(){
        let temp = this.state.fields;
        let newF = this.state.newField;
        temp[Object.keys(temp).length] = {name: newF.name, type: newF.type};
        this.setState({ 
            fields: temp,
            newField: {name: defaultNewName, type: defaultNewType},
        });
    }

    reset(){
        this.setState({ 
            fields: JSON.parse(JSON.stringify(this.state.oldFields)),
            newField: {name: defaultNewName, type: defaultNewType},
        });
    }


    // render 
    render(){        
        return <div className="entryDivs">
            {/* create new field button??? */}

            {/* Table name if creating */}
            {
                this.props.mode === "Create" 
                ? <div> 
                    Table Name: <input onChange={e => this.setState({tableName: e.target.value})} 
                                    value={this.state.tableName}/>
                </div>
                : null
            }

            {/* show all fields */}
            {Object.keys(this.state.fields).map( (i, _) => {
                i = parseInt(i, 10);
                let f = this.state.fields[i];
                let isID = (f.name === "ID");
                return <div className="entryDiv">
                    {i + 1}: 
                    {   ( isID || this.props.mode === "Delete")
                        ? // ID (cannot change) 
                        <b>{f.name}</b> 
                        : // other fields for input rename
                        <input onChange={e => {this.changeField(i, e.target.value, f.type)}} value={f.name}/>
                    }
                    {   this.props.mode === "Delete" 
                        ? // Delete : only show text
                        <b> - {f.type}</b>
                        : // Create / Edit : show selection
                        <select name={f.name} id={i + 1} value={f.type} disabled={isID}
                                onChange={e => this.changeField(i, f.name, e.target.value)}  >
                            {fieldTypes.map(function(t, _){
                                return <option value={t}>{t}</option>
                            })}
                        </select>
                    }
                </div>
            })}

            {/* new field entry (for Create / Edit) */}
            {   this.props.mode !== "Delete" 
                ? // Create / Edit : show new entry options
                <div className="entryDiv">
                    {/* {Object.keys(this.state.fields).length + 1}:  */}
                    New field:  
                    <input onChange={e => {this.changeNewFieldName(e.target.value)}} value={this.state.newField.name}/> &#9;
                    <select name="temp" id="temp" value={this.state.newField.type} onChange={e => this.changeNewFieldType(e.target.value)}>
                        
                        {fieldTypes.map((type, i) => {
                            return <option key={type} value={type}>{type}</option>
                        })}
                    </select>
                    <button onClick={e => {this.addField()}}>Add</button>
                    
                </div>
                : // Delete: no show
                null
            }

            {/* submit / clear / cancel button  */}
            <button id="submit" onClick={() => this.props.submitHandler(this.state.tableName, this.state.fields)}>{this.props.mode}</button>
            {/* <button id="submit" onClick={() => console.log(this.props.submitHandler)}>{this.props.mode}</button> */}
            { this.props.mode === "Create" ? 
                <button onClick={() => this.reset()}>Reset</button> : null
            }
            <button onClick={this.props.closeHandler}>Cancel</button>
            
        </div>
    }
}

export default EditorTable;