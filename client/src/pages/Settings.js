import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {baseURL, sendProfileImage, updateProfile} from '../http'

import {Form, FormInput, FormTitle, FormInputExplanation} from "../lib/Forms"
import {IconTextButton, TextButton} from "../lib/Buttons"

import '../styles/Settings.css'
import avatarDefault from '../assets/images/profile-image-default.jpg'



const SettingsPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id


    const [toUpdate, setToUpdate] = useState({})
    const updateUserProfile = async () => {
        try {
            if (toUpdate.name && toUpdate.name !== '') {
                await updateProfile(userId, {name:toUpdate.name})
                setToUpdate({...toUpdate,  name:''})
            }
            if (toUpdate.image) {
                const formData = new FormData()
                formData.append("name", toUpdate.image.name)
                formData.append("file", toUpdate.image)
                await sendProfileImage(userId, formData)
                // 1. set user profile photo in store

            } else {
                console.log('no file to upload')
            }
        } catch (err) {
            console.log(err)
        }
    }


    let avatar
    try {
        avatar = user.user.userData.image ? `${baseURL + user.user.userData.image}` : avatarDefault
    } catch (e) {
        avatar = avatarDefault
    }

    return (
        <div className="settings-container">
            <div className="settings-position-container">
                <h2>Public profile</h2>
                <hr style={{color: "black", backgroundColor: "black", height: 1, width:'75%'}} />

                <div className="settings-profile-image-container">
                    <img src={avatar} className="settings-profile-image" alt="profile image"/>
                    <label htmlFor="select-image">
                        <div className="settings-profile-image-btn">
                            <IconTextButton icon="EditOutlinedIcon" text="Edit"/>
                            <input type="file" accept="image/*" id="select-image" style={{display: "none"}}
                                onChange={e => setToUpdate({...toUpdate,  image: e.target.files[0]})}/>
                        </div>
                    </label>
                </div>

                <Form style={{marginTop: 12, width: '75%'}}>
                    <FormTitle text="Name"/>
                    <FormInput
                        value={toUpdate.name}
                        onChange={e => setToUpdate({...toUpdate,  name: e.target.value})}
                    />
                    <FormInputExplanation text="Your name may appear around dictionary management system
                        in your friend's notifications or share dictionary list." />
                </Form>

                <TextButton style={{marginTop: 12}} onClick={() => updateUserProfile()} text="Update profile" />
            </div>
        </div>
    )
})

export default SettingsPage;

