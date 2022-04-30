import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {updateProfile} from '../http'

import ImagePicker from '../components/ImagePicker'
import {Form, FormInput, FormTitle, FormInputExplanation} from "../lib/Forms"
import {TextButton} from "../lib/Buttons"

import '../styles/Settings.css'


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
            <div className="settings-position-container">
                <h2>Public profile</h2>
                <hr style={{color: "black", backgroundColor: "black", height: 2}} />

                <div style={{display: "flex", flexDirection: "column"}}>
                    <text>Profile picture</text>
                    <ImagePicker />
                </div>

                <Form style={{marginTop: 12}}>
                    <FormTitle text="Name"/>
                    <FormInput
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <FormInputExplanation text="Your name may appear around dictionary management system
                        in your friend's notifications or share dictionary list." />
                </Form>

                <TextButton style={{marginTop: 12}} onClick={() => updateUserProfile(name)} text="Update profile" />
            </div>
        </div>
    )
})

export default SettingsPage;

