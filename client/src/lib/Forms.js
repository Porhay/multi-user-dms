import React from "react"
import '../styles/Forms.css'


const Form = (props) => {
    return (
        <div style={props.style}>
            <form className="form">
                {props.children}
            </form>
        </div>
    )
}

const FormInput = (props) => {
    return (
        <input
            value={props.value}
            type='text'
            className="form-input"
            placeholder='Write here'
            onChange={props.onChange}
        />
    )
}

const FormTitle = (props) => {
    return (
        <h6 className="form-title">{props.text}</h6>
    )
}
const FormInputExplanation = (props) => {
    return (
        <text className="form-explanation">{props.text}</text>
    )
}


export {Form, FormInput, FormTitle, FormInputExplanation}

