import React from "react"
import '../styles/Forms.css'


const Form = (props) => {
    return (
        <form>
            {props.children}
        </form>
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
        <h6 className="form-title">{props.title}</h6>
    )
}


export {Form, FormInput, FormTitle}

