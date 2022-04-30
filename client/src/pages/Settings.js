import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {updateProfile} from '../http'

import ImagePicker from '../components/ImagePicker'
import {Form, FormInput, FormTitle} from "../lib/Forms"
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
            <text>Profile picture</text>
            <ImagePicker />

            <Form>
                <FormTitle text="Name"/>
                <FormInput
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </Form>

            <TextButton onClick={() => updateUserProfile(name)} text="Update profile" />
        </div>
    )
})

export default SettingsPage;

