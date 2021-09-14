import React from 'react';
// import { useState } from "react";
import './style/Editor.css';
import EditorRow from './Editor-row';
import EditorTable from './Editor-table';

export default function Editor(props) {

    if (props.type === "loading"){
        return (
            <div className="modal">
                <div className="modalContent">
                    <h3>Loading...</h3>
                </div>
            </div>
        )
    }

    return (
        <div className="modal">
            <div className="modalContent">
                {/* close button on the top right */}
                <span className="modalCloseButton" onClick={props.closeHandler}>&times;    </span>
                <p>{props.title}</p>

                <div className="errorMessage"><h4>{props.errorMessage}</h4></div>
                
                {/* edit row or table (Tables / Table page) */}
                {   (props.type === "row") ? 
                    <EditorRow {...props}/>
                    : 
                    <EditorTable {...props}/>
                }

            </div>
        </div>
    )
    
}

