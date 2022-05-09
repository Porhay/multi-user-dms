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

const DictionariesPage = observer(() => {
    const context = useContext(Context)
    const user = context.user.user

    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [name, setName] = useState('')
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const dropdownListFunc = (id, name) => [
        {message: 'Edit', action: () => editCurrentDictionary(id, name)},
        {message: 'Share', action: () => setShowFriendsModal(true)},
        {message: 'Delete', action: () => deleteCurrentDictionary(id)},
    ]


    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        getDictionaries(user.id).then((response) => {
            setData(response.data.reverse())
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

    const editCurrentDictionary = async (dictionaryId, name) => {
        // setState
        await createOrUpdateDictionary({userId: user.id, dictionaryId, name})
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
                            <div className="list-item-left"
                                 onClick={() => openDictionary(item.id)}
                            >
                                <LayersIcon className="list-item-icon"/>
                                <a
                                    key={item.id}
                                    className="list-item-a"
                                >
                                    {item.name}
                                </a>
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
