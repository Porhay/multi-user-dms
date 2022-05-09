import React, {useContext, useEffect, useState} from 'react'
import {Button, Container, Form} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {
    createOrUpdateDictionary,
    getDictionaries,
    deleteDictionary
} from '../http'

import {ROUTES} from "../constants";
import {Context} from "../index";

import {Dropdown} from '../components/Dropdown'
import Friends from "../modals/Friends";

import '../styles/Dictionaries.css';
import '../styles/Lists.css';

import LayersIcon from '@mui/icons-material/Layers';
import {FormInput} from "../lib/Forms";
import {TextButton} from "../lib/Buttons"; // TODO remove bootstrap to use 'Form'

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

    const setEdit = async (currentId, toOpen=true) => {
        // set {edit: true} for current
        let withEditTrueForCurrent = []
        for (const entity of data) {
            if (entity.id === currentId) {
                toOpen? entity.edit = true : entity.edit = false
            }
            withEditTrueForCurrent.push(entity)
        }
        setData(withEditTrueForCurrent)
    }

    return (
        <Container className="d-flex flex-column w-75">
            <Container className="d-flex flex mt-5 mb-1">
                <Form
                    className="w-100"
                >
                    <Form.Control
                        size="md"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={"Type dictionary name here..."}
                    />
                </Form>
                <Button size="md" variant="outline-success" onClick={newDictionary}>New</Button>
            </Container>
            <Container>
                {data.map((item) =>
                    <>
                        <div className="list-item-div">
                            <div className="list-item-left">
                                    <div>
                                        {item.edit?
                                            <div key={item.id} className="list-edit-form-div">
                                                <LayersIcon className="list-item-icon"/>
                                                <Form style={{width: '50%'}}>
                                                    <FormInput
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                    />
                                                </Form>
                                                <TextButton
                                                    onClick={async () => {
                                                        await createOrUpdateDictionary({
                                                            userId: user.id,
                                                            dictionaryId: item.id,
                                                            name: name
                                                        })}
                                                    }
                                                    style={{marginLeft: 6}} text="Update"
                                                />
                                                <TextButton
                                                    variant='cancel'
                                                    onClick={() => setEdit(item.id, false)}
                                                    style={{marginLeft: 6}} text="Cancel"
                                                />
                                            </div>
                                                :
                                            <a key={item.id} className="list-item-a">
                                                <LayersIcon className="list-item-icon"/>
                                                <span onClick={() => openDictionary(item.id)}>
                                                    {item.name}
                                                </span>
                                            </a>
                                        }
                                    </div>
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
            </Container>
        </Container>
    )
})

export default DictionariesPage
