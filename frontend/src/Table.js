import React, { Component } from 'react';
import Editor from './Editor';
import { getTable, postTableEditorSubmit } from './fetch';
import './style/Table.css';

const constTableKey = "ID";

class Table extends Component {
    constructor(props) {
        super(props);

        // enable the use of this in functions
        this.openCreateEditor = this.openCreateEditor.bind(this);
        this.openEditEditor = this.openEditEditor.bind(this);
        this.openDelEditor = this.openDelEditor.bind(this);
        this.closeEditor = this.closeEditor.bind(this);
        this.createSubmit = this.createSubmit.bind(this);
        this.editSubmit = this.editSubmit.bind(this);
        this.delSubmit = this.delSubmit.bind(this);

        this.state = {            
            // enable/disable loading screen
            loading: true,
            // fetch placeholders
            result: null,
            columns: null,
            // modal
            editorDisplay: false,
            fieldValue: null,
            editorType: "row"
        };
    }

    // -------------------------------- open editor ------------------------------- //
    // modify states for opening create entry editor
    openCreateEditor(){
        this.setState({
            editorDisplay: true,
            editorMode: "Create",
            editorTitle: "Create a new Entry",
            fieldValue: null,
            submitHandler: this.createSubmit
        })
    }
    // modify states for opening edit entry editor
    openEditEditor(rw){
        this.setState({
            editorDisplay: true,
            editorMode: "Edit",
            editorTitle: "Edit an existing record",
            fieldValue: rw,
            submitHandler: this.editSubmit
        })
    }
    // modify states for opening delete entry editor
    openDelEditor(rw){
        this.setState({
            editorDisplay: true,
            editorMode: "Delete",
            editorTitle: "Are you sure to delete this entry?",
            fieldValue: rw,
            submitHandler: this.delSubmit
        })
    }
    // close handler for editor
    closeEditor(){
        this.setState({
            editorDisplay: false,
        })
    }

    // ---------------------------------- fetch --------------------------------- //
    // fetch create entry request
    createSubmit(cellData){
        var submit = {
            // table + data
            table: this.props.table,
            data: cellData,
        };

        postTableEditorSubmit(this, submit, "tables/create-entry", ((obj) => {getTable(obj)}));
    }
    // fetch edit entry request
    editSubmit(cellData){
        var keyValue = cellData[constTableKey];
        delete cellData[constTableKey];

        // table + key + data
        var submit = {
            table: this.props.table,
            key: { [constTableKey]: keyValue }, 
            data: cellData,
        };

        postTableEditorSubmit(this, submit, "tables/edit-entry", ((obj) => {getTable(obj)}));
    }
    // fetch delete entry request    
    delSubmit(cellData){
        var keyValue = cellData[constTableKey];
        
        // table + key
        var submit = {
            table: this.props.table,
            key: { [constTableKey]: keyValue }, 
        };

        postTableEditorSubmit(this, submit, "tables/del-entry", ((obj) => {getTable(obj)}));
    }

    // ----------------------------- component control ----------------------------- //
    componentDidMount() {
        // get Tables when the componenet mounted
        getTable(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.table !== prevProps.table) {
            // refetch data
            getTable(this);
        }
    }

    // ---------------------------------- render --------------------------------- //
    render() {
        if (this.state.loading) { return <h3>LOADING...</h3>; }
    
        return (
            <div>
                <h2>{this.props.table}</h2>
                
                {/* Editor modal */}
                { this.state.editorDisplay ? 
                    <Editor 
                        type={this.state.editorType}
                        mode={this.state.editorMode} 
                        title={this.state.editorTitle} 
                        submitHandler={this.state.submitHandler}
                        columns={this.state.columns}
                        fieldValue={this.state.fieldValue}

                        closeHandler={this.closeEditor}
                    /> 
                    : null 
                }

                {/* Button for open editor */}
                <button onClick={this.openCreateEditor}>Create new entry</button> 
                <br/><br/>


                {/* List of entries */}
                <table className="actualDataTable"><tbody>
                    <tr>
                    {/* { [...this.state.columns].map( function(k, i){ */}
                    { ((Object.keys(this.state.result).length > 0) ? Object.keys(this.state.result[0]) : [...this.state.columns]).map( function(k, i){

                        return <th key={k}>{k}</th>
                    })}
                    </tr>
                    {(Object.keys(this.state.result).length > 0) ? this.state.result.map((rw, i) => {
                        // return <tr key={i}><td>{tn}</td></tr>
                        return (
                            <tr key={i}>
                                { Object.keys(rw).map( function(k, i){ 
                                    return <td key={i + rw[k]}>{rw[k]}</td> } ) }
                                <td><button onClick={e => this.openEditEditor(rw)}>Edit</button></td>
                                <td><button onClick={e => this.openDelEditor(rw)}>Delete</button></td>
                            </tr> 
                        )
                    }) : null }
                </tbody></table>
            </div>
        );
        
    }
}

export default Table;