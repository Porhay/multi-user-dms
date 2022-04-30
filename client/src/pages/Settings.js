import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite";

import {updateProfile} from '../http'
import {Context} from "../index";
import ImagePicker from '../components/ImagePicker'
import '../styles/Settings.css';


const SettingsPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const [name, setName] = useState('')
    const updateUserProfile = async (name) => {
        const fields = {name}
        await updateProfile(userId, fields)
        setName('')
    }


    return (
        <div className="settings-container">
                Profile picture
                <ImagePicker />

                <h6>Name</h6>

                <form>
                    <input
                        type='text'
                        className="form-control"
                        placeholder='Write your name here'
                        onChange={e => setName(e.target.value)}
                    />
                </form>
                <a className="submit-button" onClick={() => updateUserProfile(name)}>Update profile</a>


        </div>
    )
})

export default SettingsPage;

