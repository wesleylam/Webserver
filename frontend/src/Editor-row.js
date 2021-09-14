import React from 'react';
import { useState } from 'react';
import './style/Editor.css';

function clearInputs(setStateLib){
    for (let c in setStateLib){
        setStateLib[c]("")
    }
}

export default function EditorRow(props) {
    // initialize states 
    const stateLib = {}
    const setStateLib = {}
    for (let i in props.columns){
        let c = props.columns[i];
        [ stateLib[c], setStateLib[c] ] = useState( (props.mode === "Create") ? "" : props.fieldValue[c] )
    }

    // propergate back clear button action handler
    // props.setSubmitFunc( () => props.submitHandler(stateLib) )
    // props.setClearFunc( () => clearInputs(setStateLib) )

    return <div className="entryDivs">
        {[...props.columns].map( function(k, i){ 
            return <div className="entryDiv"> {k}: &nbsp;
                {   
                    (props.mode === "Delete" || ((k === "ID") && (props.mode === "Edit"))) 
                    ?
                    // display only
                    <b>{stateLib[k]}</b>
                    :
                    // text input field
                    <input onChange={e => {setStateLib[k](e.target.value)}} value={stateLib[k]}/> 
                }
            </div>
        })}

        {/* submit / clear / cancel button  */}
        <button id="submit" onClick={() => props.submitHandler(stateLib)}>{props.mode}</button>
        { props.mode === "Create" ? 
            <button onClick={() => clearInputs(setStateLib)}>Clear</button> : null
        }
        <button onClick={props.closeHandler}>Cancel</button>
    </div>
}    

