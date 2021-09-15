import React, { Component } from 'react';
import {
    // Redirect,
    // BrowserRouter as Router,
    Link,
    // Route,
} from 'react-router-dom';
import getTables, {getTableColumnInfo, postTableEditorSubmit } from './fetch';
// import { getTables, getTableColumn} from './fetch';
import './style/Tables.css';
import Editor from './Editor';

const loadingKey = "fetchingColumnInfo";

class Tables extends Component {
    constructor(props) {
        super(props);

        // enable the use of this on all sub-functions
        this.openCreateTableEditor = this.openCreateTableEditor.bind(this);
        this.openEditTableEditor = this.openEditTableEditor.bind(this);
        this.openDropTableEditor = this.openDropTableEditor.bind(this);
        this.createTableSubmit = this.createTableSubmit.bind(this);
        this.editTableSubmit = this.editTableSubmit.bind(this);
        this.dropTableSubmit = this.dropTableSubmit.bind(this);
        this.closeEditor = this.closeEditor.bind(this);

        this.state = {            
            // enable/disable loading screen
            loading: true,
            tables: [],
            editorType: "table",
            
            // for edit / drop table
            [loadingKey]: false,
            columnInfo: null,
        };
    }

    // ------------------------------- open editor ------------------------------- //
    // configure editor settings for display (create, edit, drop)
    setEditorConfig(targetTable, editorDisplay, editorMode, editorTitle, submitHandler, extra){
        this.setState({
            targetTable: targetTable,
            editorDisplay: editorDisplay,
            editorMode: editorMode,
            editorTitle: editorTitle,
            submitHandler: submitHandler,

            // reset error message
            editorErrorMessage: "",
            // extra parameters
            ...extra,
        });
    }
    // modify states for opening create table editor
    openCreateTableEditor(){
        let extra = {
            // default compulsary ID as integer 
            fieldValue: {
                0: {name: "ID", type: "integer"},
            }
        }
        this.setEditorConfig("", true, "Create", "Create a new Table", this.createTableSubmit, extra)
        // this.setState({
        //     targetTable: "",
        //     editorDisplay: true,
        //     editorMode: "Create",
        //     editorTitle: "Create a new Table",
        //     submitHandler: this.createTableSubmit,

        // });
    }
    // modify states for opening create table editor
    openEditTableEditor(tn){ // tn: table name

        // fetch table column info
        getTableColumnInfo(this, tn, loadingKey)

        this.setEditorConfig(tn, true, "Edit", "Edit table: " + tn, this.editTableSubmit)

        // this.setState({
        //     targetTable: tn,
        //     editorDisplay: true,
        //     editorMode: "Edit",
        //     editorTitle: "Edit table: " + tn,
        //     submitHandler: this.editTableSubmit,
        // });        
    }
    // modify states for opening create table editor
    openDropTableEditor(tn){ // tn: table name

        // fetch table column info
        getTableColumnInfo(this, tn, loadingKey)

        this.setEditorConfig(tn, true, "Delete", "Are you sure to drop table - " + tn + "?", this.dropTableSubmit)

        // this.setState({
        //     targetTable: tn,
        //     editorDisplay: true,
        //     editorMode: "Delete",
        //     editorTitle: "Are you sure to drop table - " + tn + "?",
        //     submitHandler: this.dropTableSubmit,
        // });        
    }
    // close handler for editor
    closeEditor(){
        this.setState({ editorDisplay: false });
    }

    // ---------------------------------- fetch --------------------------------- //
    // fetch create table request
    createTableSubmit(tn, fields){
        if (tn.trim() === "") {
            this.setState({ editorErrorMessage: "Table name cannot be blank" });
        } else if (Object.keys(fields) <= 1) {
            this.setState({ editorErrorMessage: "Add at least one field to create a table" });
        } else { 
            // remove ID (maybe can still send, but need to remove server side ID, also need to specify primary key)
            delete fields[0];
            // Transform into suitable format
            let submitFields = {};
            for (const i in fields){
                let f = fields[i]
                submitFields[f.name] = f.type
            }

            let submit = {
                table: tn,
                fields: submitFields
            }   
            postTableEditorSubmit(this, submit, "tables/create-table", (() => {window.location.reload(false);}));
        }
    }
    // fetch edit table request
    editTableSubmit(){
        alert("Work in progress");
    }
    // fetch drop table request
    dropTableSubmit(tn){
        // table + key
        let submit = {
            table: tn,
        };

        postTableEditorSubmit(this, submit, "tables/drop-table", (() => {window.location.reload(false);}));
    }

    // ----------------------------- component control ----------------------------- //
    componentDidMount() {
        // get Tables when the componenet mounted
        getTables(this);
    }


    // ---------------------------------- render --------------------------------- //
    render() {
        // console.log(this.state)
        // loading screen
        if (this.state.loading) { return <h3>LOADING...</h3>; }
    
        return <div>
            <h2>All Tables</h2>

            {/* Editor modal */}
            { this.state.editorDisplay ? 
                this.state[loadingKey] ? 
                <Editor type={"loading"} />
                : 
                <Editor 
                    
                    type={this.state.editorType}
                    mode={this.state.editorMode} 
                    title={this.state.editorTitle}
                    submitHandler={this.state.submitHandler}
                    tableName={this.state.targetTable}

                    // predefined value (for create)
                    fieldValue={this.state.fieldValue}
                    // response from api (for edit and drop)
                    columnInfo={this.state.columnInfo}
                    editorLoading={this.state[loadingKey]}

                    // error message
                    errorMessage={this.state.editorErrorMessage}
                    
                    closeHandler={this.closeEditor}
                /> 
                : null 
            }
            
            {/* Button for open editor */}
            <button onClick={this.openCreateTableEditor}>Create a new table</button> 
            <br/><br/>
            {/* file selector */}
            {/* <input type="file" name="file" onChange={event=>{console.log(event.target.files[0])}} /> */}
            <br/><br/>



            {/* List of tables */}
            <table className="tablesList"><tbody>
                <tr><th>#</th><th>Table</th><th></th><th></th></tr>
                {this.state.tables.map((tn, i) => {
                    return (
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td className="noPadding"><Link to={"/tables/" + tn}><td className="noBorder">{tn}</td></Link></td>
                            <td><button onClick={ () => this.openEditTableEditor(tn) }>Edit</button></td>
                            <td><button onClick={ () => this.openDropTableEditor(tn) }>Drop</button></td>                    
                        </tr> 
                    )
                })}
            </tbody></table>
        </div>
        
    }
}

export default Tables;