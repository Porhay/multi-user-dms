import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {baseURL, updateProfile} from '../http'

import ImagePicker from '../components/ImagePicker'
import {Form, FormInput, FormTitle, FormInputExplanation} from "../lib/Forms"
import {IconTextButton, TextButton} from "../lib/Buttons"

import '../styles/Settings.css'
import avatarDefault from '../assets/images/profile-image-default.jpg'



const SettingsPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const [showModal, setShowModal] = useState(false)


    const [name, setName] = useState('')
    const updateUserProfile = async (name) => {
        const fields = {name}
        await updateProfile(userId, fields)
        setName('')
    }

    let avatar
    try {
        avatar = user.user.userData.image ? `${baseURL + user.user.userData.image}` : avatarDefault
    } catch (e) {
        avatar = avatarDefault
    }

    return (
        <div className="settings-container">
            <ImagePicker show={showModal} onHide={() => setShowModal(false)} />
            <div className="settings-position-container">
                <h2>Public profile</h2>
                <hr style={{color: "black", backgroundColor: "black", height: 1, width:'75%'}} />

                <div className="settings-profile-image-container">
                    <img src={avatar} className="settings-profile-image" alt="profile image"/>
                    <div className="settings-profile-image-btn">
                        <IconTextButton icon="EditOutlinedIcon" text="Edit" onClick={() => setShowModal(!showModal)}/>
                    </div>
                </div>

                <Form style={{marginTop: 12, width: '75%'}}>
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

