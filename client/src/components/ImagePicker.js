import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import {sendProfileImage} from '../http'

import {IconTextButton} from '../lib/Buttons'
// import Form from '../lib/Forms'

import '../styles/ImagePicker.css';


const ImagePicker = observer((props) => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const [drag, setDrag] = useState(false)
    const [file, setFile] = useState(null)

    const [open, setOpen] = useState(false);


    const dragStartHandler = (e) => {
        e.preventDefault()
        setDrag(true)
    }
    const dragLeaveHandler = (e) => {
        e.preventDefault()
        setDrag(false)
    }
    const onDropHandler = async (e) => {
        e.preventDefault()
        setFile(e.dataTransfer.files[0])
        if (file) {
            const formData = new FormData()
            const fileName = `${Date.now()}${file.name}`
            formData.append("name", fileName)
            formData.append("file", file)
            try {
                await sendProfileImage(userId, formData)
            } catch (err) {
                console.log(err)
            }
        }
        setDrag(false)
    }


    return (
        <>
            <IconTextButton icon="EditOutlinedIcon" text="Edit" onClick={() => setOpen(!open)}/>
            {open &&
                <div className="image-picker-container-fade">
                    <div className="image-picker-container">
                        <a className="close-button" onClick={() => setOpen(false)}>+</a>
                        {drag ? <div
                                className="drop-area"
                                onDragStart={e => dragStartHandler(e)}
                                onDragLeave={e => dragLeaveHandler(e)}
                                onDragOver={e => dragStartHandler(e)}
                                onDrop={e => onDropHandler(e)}
                            >Drop file to upload</div> :
                            <div
                                onDragStart={e => dragStartHandler(e)}
                                onDragLeave={e => dragLeaveHandler(e)}
                                onDragOver={e => dragStartHandler(e)}
                            >
                                <div className="select-image-div">
                                    <label htmlFor="file" className="download-image-label">
                                        <span>Select image</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept=".png,.jpeg,.jpg"
                                        onChange={e => setFile(e.target.files[0])}
                                        id="file"
                                        style={{display: "none"}}
                                    ></input>
                                </div>
                                <div className="drag-file-text-div">
                                    or drag file to upload
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
})

export default ImagePicker;

