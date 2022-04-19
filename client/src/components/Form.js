import React from 'react';
import '../styles/Form.css';

function Form() {
    return (
        <div className="wrapper">
            <form onSubmit={() => console.log('halo')}>
                <label>
                    <input placeholder="Type dictionary name here..."/>
                </label>
                <button className="wrapper" type="submit">New</button>
            </form>
        </div>
    )
}

export default Form;
