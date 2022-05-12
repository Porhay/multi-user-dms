import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {generateRandomDigit} from "../helpers";
import {ROUTES} from "../constants";
import {Context} from "../index";

import Friends from "../modals/Friends";
import {Dropdown} from '../components/Dropdown'
import {Form, FormInput, FormInputExplanation, FormTitle} from "../lib/Forms";
import {TextButton} from "../lib/Buttons";
import {Icon} from "../lib/Icons";

import {
    createOrUpdateDictionary,
    getDictionaries,
    deleteDictionary
} from '../http'

import '../styles/Dictionaries.css';
import '../styles/Lists.css';


const DictionariesPage = observer(() => {
    const navigate = useNavigate()
    const context = useContext(Context)
    const user = context.user.user

    // Global state
    const [state, setState] = useState({
        nameOfNew: '',
        nameToEdit: '',
        showModal: false,
    })

    // All dictionaries data
    const [data, setData] = useState([])

    const dropdownListFunc = (id) => [
        {message: 'Edit', action: () => setEdit(id)},
        {message: 'Share', action: () => setState({...state, showModal:true})},
        {message: 'Delete', action: () => deleteCurrentDictionary(id)},
    ]

    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        getDictionaries(user.id).then((response) => {
            let dictionaries = response.data.reverse()

            // add edit, icon rows for every
            for (const entity of dictionaries) {
                entity.edit = false
                entity.iconIndex = generateRandomDigit()
            }
            console.log(dictionaries)
            setData(dictionaries)
        })
    }

    const newDictionary = async () => {
        const newDictionary = await createOrUpdateDictionary({userId: user.id, name:state.nameOfNew})
        setData(prevState => [newDictionary.data, ...prevState])
        setState({...state, nameOfNew:''})
    }

    const openDictionary = async (dictionaryId) => {
        navigate(ROUTES.ENTRIES + '/' + dictionaryId)
    }

    const deleteCurrentDictionary = async (dictionaryId) => {
        await deleteDictionary(user.id, dictionaryId).catch(e => console.log(e))
        setData([...data.filter(item => item.id !== dictionaryId)])
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
        setState({...state,  nameToEdit:''})
    }

    const setEdit = (currentId, toOpen = true) => {
        let withEditTrueForCurrent = []
        for (const entity of data) {
            if (entity.id === currentId) {
                if(toOpen) {
                    setState({...state, nameToEdit: entity.name})
                    entity.edit = true
                } else {
                    entity.edit = false
                }
            }
            withEditTrueForCurrent.push(entity)
        }
        setData(withEditTrueForCurrent)
    }

    return (
        <div className="dictionary-container">
            <div className="dictionary-position-container">
                {/*<h2>Dictionary page</h2>*/}
                {/*<hr style={{color: "black", backgroundColor: "black", height: 1, width: '100%'}}/>*/}

                <div style={{display: 'flex'}}>
                    <Form style={{marginTop: 6, width: '100%'}}>
                        <FormTitle text="Name your future masterpiece"/>
                        <FormInput
                            value={state.nameOfNew}
                            onChange={e => setState({...state,  nameOfNew: e.target.value})}
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
                                            <Icon icon={item.iconIndex} style={{marginRight: 6}} />
                                            <Form>
                                                <FormInput
                                                    value={state.nameToEdit}
                                                    onChange={e => setState({...state,  nameToEdit: e.target.value})}
                                                />
                                            </Form>
                                            <TextButton
                                                onClick={() => updateCurrentDictionary(item.id, state.nameToEdit)}
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
                                            <Icon icon={item.iconIndex} style={{marginRight: 6}} />
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
                                show={state.showModal}
                                onHide={() => setState({...state, showModal:false})}
                            />
                        </>
                    )}
                </div>

            </div>
        </div>
    )
})

export default DictionariesPage
