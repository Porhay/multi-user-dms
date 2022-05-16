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
import '../styles/Lists.css'
import LayersIcon from "@mui/icons-material/Layers";


const SettingsPage = observer(() => {
    const context = useContext(Context)
    const user = context.user.user


    // Global state
    const [state, setState] = useState({
        tab: 'profile' // 'account'
    })

    const tabsList = [
        {tab: 'profile', name: 'Profile', action: () => console.log("Halo Profile!")},
        {tab: 'account', name: 'Account', action: () => console.log("Halo Account!")},
    ]


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

                <div style={{marginRight: '5%', width: '25%'}}>
                    <h2 style={{fontWeight: 500}}>Settings</h2>
                    <hr style={{color: "black", backgroundColor: "black", height: 1}}/>
                    {tabsList.map((item) => (
                        <div
                            className="list-item-div"
                            onClick={() => setState({
                                ...state,
                                tab: item.tab
                            })}
                        >
                            <div className="list-item-left">
                                <LayersIcon className="list-item-icon"/>
                                <a style={{fontWeight: 400}} key={item.tab}  className="list-item-a">
                                    {item.name}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    {(function () {
                        if (state.tab === 'profile') {
                            return (
                                <>
                                    <div className="settings-profile-image-container">
                                        <img src={preview || `${baseURL + user.userData.image}` || avatarDefault}
                                             className="settings-profile-image" alt="profile image"/>
                                        <label htmlFor="select-image">
                                            <div className="settings-profile-image-btn">
                                                <IconTextButton icon="EditOutlinedIcon" text="Edit"/>
                                                <input type="file" accept="image/*" id="select-image"
                                                       style={{display: "none"}}
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

                                        <TextButton style={{marginTop: 12}} onClick={() => updateUserProfile()}
                                                    text="Update profile"/>
                                    </div>
                                </>
                            )
                        }
                        if (state.tab === 'account') {
                            return (
                                <>
                                    <div style={{width: '100%'}}>
                                        <h2>Account settings</h2>
                                        <hr style={{color: "black", backgroundColor: "black", height: 1}}/>


                                        <div style={{display: 'flex'}}>
                                            <Form style={{marginTop: 6, width: '100%'}}>
                                                <FormTitle text="Username"/>
                                                <FormInput
                                                    value={toUpdate.name}
                                                    onChange={e => setToUpdate({...toUpdate, name: e.target.value})}
                                                />
                                                <FormInputExplanation text="Username must be unique! You can always change it anytime."/>
                                                <div style={{marginTop: 6}}>
                                                    <IconTextButton
                                                        onClick={() => console.log('Username')}
                                                        icon="EditOutlinedIcon"
                                                        text="Reset"
                                                    />
                                                </div>
                                            </Form>

                                        </div>




                                        <h5 style={{marginTop: 36}}>Login & Password</h5>
                                        <hr style={{marginTop: 6, marginBottom: 8, color: "black", backgroundColor: "black", height: 0.5}}/>

                                        <div className='settings-email-password-div'>
                                            <div style={{display: 'flex'}}>
                                                <Form style={{marginTop: 6, width: '100%'}}>
                                                    <FormTitle text="User password"/>
                                                    <FormInput
                                                        value={toUpdate.name}
                                                        onChange={e => setToUpdate({...toUpdate, name: e.target.value})}
                                                    />
                                                    <FormInputExplanation text="You will receive a message on your email box.
                                                                Step by the link to change profile password or leave if is it not you."/>
                                                </Form>
                                                <TextButton style={{marginTop: 25.5}} onChange={() => console.log('Email')}
                                                            text="Change"/>
                                            </div>
                                        </div>


                                        <h5 style={{marginTop: 36}}>Powered by somebody</h5>
                                        <hr style={{marginTop: 6, marginBottom: 4, color: "black", backgroundColor: "black", height: 0.5}}/>
                                        <FormInputExplanation
                                            text="You can always send me email to ask any questions you want."/>

                                    </div>
                                </>
                            )
                        }
                    })()}
                </div>
            </div>
        </div>
    )
})

export default SettingsPage;

