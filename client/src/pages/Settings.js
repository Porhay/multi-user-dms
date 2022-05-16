import React, {useContext, useState} from "react"
import {ToastContainer, toast} from 'react-toastify'
import {observer} from "mobx-react-lite"

import {baseURL, sendProfileImage, updateProfile} from '../http'
import {Context} from "../index"

import {Form, FormInput, FormTitle, FormInputExplanation} from "../lib/Forms"
import {IconTextButton, TextButton} from "../lib/Buttons"
import {readURL} from "../helpers"

import avatarDefault from '../assets/images/profile-image-default.jpg'
import '../styles/Settings.css'


const SettingsPage = observer(() => {
    const context = useContext(Context)
    const user = context.user.user


    const [toUpdate, setToUpdate] = useState({})
    const [preview, setPreview] = useState('')
    const updateUserProfile = async () => {
        try {
            if (toUpdate.name && toUpdate.name !== '') {
                await updateProfile(user.id, {name: toUpdate.name})
                setToUpdate({...toUpdate, name: ''})
            }
            if (toUpdate.image) {
                const formData = new FormData()
                formData.append("name", toUpdate.image.name)
                formData.append("file", toUpdate.image)
                const response = await sendProfileImage(user.id, formData)

                // update global store
                context.user.updateUserData({image: response.data.image})
            } else {
                console.log('no file to upload')
            }

            // notification
            toast.success('Profile updated', {
                position: "top-right", autoClose: 2000,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true
            })
        } catch (err) {
            console.log(err)
        }
    }

    // TODO `${baseURL + user.userData.image}` throw err when image is null
    return (
        <div className="settings-container">
            <ToastContainer
                style={{marginTop: 30}} position="top-right" autoClose={5000}
                closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
            />
            <div className="settings-position-container">
                <div className="settings-profile-image-container">
                    <img src={preview || `${baseURL + user.userData.image}` || avatarDefault}
                         className="settings-profile-image" alt="profile image"/>
                    <label htmlFor="select-image">
                        <div className="settings-profile-image-btn">
                            <IconTextButton icon="EditOutlinedIcon" text="Edit"/>
                            <input type="file" accept="image/*" id="select-image" style={{display: "none"}}
                                   onChange={event => {
                                       const newImage = event.target.files[0]
                                       setToUpdate({...toUpdate, image: newImage})
                                       readURL(newImage).then((imageUrl) => {
                                           setPreview(imageUrl)
                                       })
                                   }}/>
                        </div>
                    </label>
                </div>

                <div style={{width: '75%'}}>
                    <h2>Public profile</h2>
                    <hr style={{color: "black", backgroundColor: "black", height: 1}}/>
                    <Form style={{marginTop: 12, width: '100%'}}>
                        <FormTitle text="Name"/>
                        <FormInput
                            value={toUpdate.name}
                            onChange={e => setToUpdate({...toUpdate, name: e.target.value})}
                        />
                        <FormInputExplanation text="Your name may appear around dictionary management system
                        in your friend's notifications or share dictionary list."/>
                    </Form>

                    <TextButton style={{marginTop: 12}} onClick={() => updateUserProfile()} text="Update profile"/>
                </div>

                {
                    // TODO add left side menu list for different types of settings
                    false?
                        <div style={{width: '95%'}}>
                        <h4 style={{marginTop: 26, marginBottom: 2, padding: 0}}>Account Settings</h4>
                        <hr style={{margin: 0, color: "black", backgroundColor: "black", height: 0.5}}/>
                        <div style={{display:'flex'}}>
                            <Form style={{marginTop: 6, width: '100%'}}>
                                <FormTitle text="Email address"/>
                                <FormInput
                                    value={toUpdate.name}
                                    onChange={e => setToUpdate({...toUpdate, name: e.target.value})}
                                />
                                <FormInputExplanation text="You will receive a message on your email box.
                                Go by the link to change profile email address."/>
                            </Form>
                            <TextButton style={{marginTop: 25.5}} onChange={() => console.log('Email')} text="Change"/>
                        </div>
                        <div style={{display:'flex'}}>
                            <Form style={{marginTop: 6, width: '100%'}}>
                                <FormTitle text="Password"/>
                                <FormInput
                                    value={toUpdate.name}
                                    onChange={e => setToUpdate({...toUpdate, name: e.target.value})}
                                />
                                <FormInputExplanation text="Protect your account. Its recommended to use 8-digit password."/>
                            </Form>
                            <TextButton style={{marginTop: 25.5}} onClick={() => console.log('Password')} text="Change"/>
                        </div>
                        <div style={{display:'flex'}}>
                            <Form style={{marginTop: 6, width: '100%'}}>
                                <FormTitle text="Username"/>
                                <FormInput
                                    value={toUpdate.name}
                                    onChange={e => setToUpdate({...toUpdate, name: e.target.value})}
                                />
                                <FormInputExplanation text="Username must be unique! You can always change it anytime."/>
                            </Form>
                            <TextButton style={{marginTop: 25.5}} onClick={() => console.log('Username')} text="Change"/>
                        </div>
                    </div> :
                        null
                }
            </div>
        </div>
    )
})

export default SettingsPage;

