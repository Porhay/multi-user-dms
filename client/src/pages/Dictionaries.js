import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {ROUTES} from "../constants";
import {Context} from "../index";

import {Dropdown} from '../components/Dropdown'
import Friends from "../modals/Friends";
import {Form, FormInput, FormInputExplanation, FormTitle} from "../lib/Forms";
import {TextButton} from "../lib/Buttons";

import {
    createOrUpdateDictionary,
    getDictionaries,
    deleteDictionary
} from '../http'

import LayersIcon from '@mui/icons-material/Layers';
import '../styles/Dictionaries.css';
import '../styles/Lists.css';


const DictionariesPage = observer(() => {
    const context = useContext(Context)
    const user = context.user.user

    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [name, setName] = useState('') // TODO merge with update like one object
    const [showFriendsModal, setShowFriendsModal] = useState(false)
    const dropdownListFunc = (id) => [
        {message: 'Edit', action: () => setEdit(id)},
        {message: 'Share', action: () => setShowFriendsModal(true)},
        {message: 'Delete', action: () => deleteCurrentDictionary(id)},
    ]


    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        getDictionaries(user.id).then((response) => {
            let dictionaries = response.data.reverse()

            // add edit row for every
            for (const entity of dictionaries) {
                entity.edit = false
            }
            setData(dictionaries)
        })
    }

    const newDictionary = async () => {
        const newDictionary = await createOrUpdateDictionary({userId: user.id, name})
        setData(prevState => [newDictionary.data, ...prevState])
        setName('')
    }

    const openDictionary = async (dictionaryId) => {
        navigate(ROUTES.ENTRIES + '/' + dictionaryId)
    }

    const deleteCurrentDictionary = async (dictionaryId) => {
        setData([...data.filter(item => item.id !== dictionaryId)])
        await deleteDictionary(user.id, dictionaryId)
    }

    const updateCurrentDictionary = async (dictionaryId, name) => {
        await createOrUpdateDictionary({
            userId: user.id,
            dictionaryId,
            name: name
        })

        for (const entity of data) {
            if (entity.id === dictionaryId) {
                entity.name = name
            }
        }

        // close
        setEdit(dictionaryId, false)
        setName('')
    }

    const setEdit = (currentId, toOpen = true) => {
        let withEditTrueForCurrent = []
        for (const entity of data) {
            if (entity.id === currentId) {
                toOpen ? entity.edit = true : entity.edit = false
            }
            withEditTrueForCurrent.push(entity)
        }
        setData(withEditTrueForCurrent)
    }

    return (
        <div className="dictionary-container">
            <div className="dictionary-position-container">
                <h2>Dictionary page</h2>
                <hr style={{color: "black", backgroundColor: "black", height: 1, width: '100%'}}/>

                <div style={{display: 'flex'}}>
                    <Form style={{marginTop: 6, width: '100%'}}>
                        <FormTitle text="Name your future masterpiece"/>
                        <FormInput
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <FormInputExplanation
                            text="That name can be edited in future, you always can delete your dictionary"/>
                    </Form>
                    <TextButton style={{marginTop: 25}} onClick={() => newDictionary()} text="New"/>
                </div>

                <div className="dictionary-list-div">
                    {data.map((item) =>
                        <>
                            <div className="list-item-div">
                                <div className="list-edit-form-general-div">
                                    {item.edit ?
                                        <div key={item.id} className="list-edit-form-div">
                                            <LayersIcon className="list-item-icon"/>
                                            <Form>
                                                <FormInput
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                />
                                            </Form>
                                            <TextButton
                                                onClick={() => updateCurrentDictionary(item.id, name)}
                                                text="Update"
                                            />
                                            <TextButton
                                                variant='cancel'
                                                onClick={() => setEdit(item.id, false)}
                                                text="Cancel"
                                            />
                                        </div>
                                        :
                                        <div className="list-edit-form-div">
                                            <LayersIcon className="list-item-icon"/>
                                            <a key={item.id} className="list-item-a">
                                                <span onClick={() => openDictionary(item.id)}>
                                                    {item.name}
                                                </span>
                                            </a>
                                        </div>
                                    }
                                </div>
                                <Dropdown
                                    className='item-dropdown' icon='Options'
                                    items={dropdownListFunc(item.id, item.name)}
                                />
                            </div>

                            <Friends
                                item={item}
                                show={showFriendsModal}
                                onHide={() => setShowFriendsModal(false)}
                            />
                        </>
                    )}
                </div>

            </div>
        </div>
    )
})

export default DictionariesPage
