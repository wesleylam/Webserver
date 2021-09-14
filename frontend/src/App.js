import './style/App.css';
import React, { Component } from 'react';
// import { useState, useEffect } from "react";
import {
    // Redirect,
    BrowserRouter as Router,
    Link,
    Route,
} from 'react-router-dom';
import Tables from './Tables';
import Table from './Table';
import getTables from './fetch';
import logo from "./logo.png"

document.title = "noob"

// Main entry of the app
class App extends Component {
    constructor(props) {
        super(props);

        // // enable the use of "this" in following methods
        // this.register = this.register.bind(this);
        // this.login = this.login.bind(this);
        // this.logout = this.logout.bind(this);

        // initialize states
        this.state = {
            // // JWT token for fetch authentication
            // JWT: sessionStorage.getItem("JWT"),
            // // store registered email and password after user registers for instant login
            // registerFollowup: null,
            
            // enable/disable loading screen
            loading: true,
            tables: []
        };
    }

    componentDidMount() {
        // get Tables when the componenet mounted
        getTables(this);
    }

    render() {
        return (
            <Router>
            <div className="App">
                <div className="Nav">
                <ul className="Nav">

                    {/* Home page image button */}
                    <Link to={`/`}>
                        <li className="icon Links" key="logo">
                            <img
                                src={logo}
                                alt="LOGO"
                                height="50px"></img>
                        </li>
                    </Link>

                    {/* list of tables */}
                    <div className="NavTable">
                    <Link to={`/tables`} className="NavTablesLink"> <li className="Links TablesLink" key="tables" >Tables</li></Link>
                    {this.state.loading === false ?
                        <div className="NavTableDropdown">
                            {this.state.tables.map(function(tn, i){
                                return <Link to={"/tables/" + tn}><li className="Links IndTableLink" key={"table_" + tn}>{tn}</li></Link>
                            })}
                        </div>
                        : null
                    }
                    </div>
                    <Link to={`/tables`} className="NavTablesLink"> <li className="Links TablesLink" key="tables3" >TEMP TABLES</li></Link>
                </ul>
                </div>

                <main>
                    {/* Route to multiple paths:  */}
                    {/* 1. home */}
                    {/* <Route exact path="/" component={() => <Home JWT={this.state.JWT} />} /> */}
                    <Route exact path="/">
                        This page is blank
                    </Route>

                    {/* 2. Tables */}
                    <Route exact path="/tables"  component={Tables} />

                    {/* 2.5 specific table */}
                    <Route path="/tables/:tb" component={(props) =>
                            <Table table={props.match.params.tb} />}
                        />

                </main>
                
            </div>
            </Router>
        );
    }
}
export default App;
