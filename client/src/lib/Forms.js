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
    let formInputStyle = {
        div: 'form-input-div-standard',
        input: 'form-input-standard'
    }
    if (props.variant === 'space-left') {
        formInputStyle = {
            div: 'form-input-div-space-left',
            input: 'form-input-space-left'
        }
    }
    return (
        <div className={formInputStyle.div}>
            {props.children}
            <input
                value={props.value}
                className={formInputStyle.input}
                type='text'
                onChange={props.onChange}
                placeholder='Write here'
            />
        </div>
    )
}

const FormTitle = (props) => {
    return (
        <h6 className="form-title">{props.text}</h6>
    )
}
const FormInputExplanation = (props) => {
    return (
        <span className="form-explanation">{props.text}</span>
    )
}


export {Form, FormInput, FormTitle, FormInputExplanation}

