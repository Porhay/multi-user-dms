import React, {useContext, useEffect, useState} from 'react'
import {Button, Container, Form} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {createDictionary, getDictionaries, deleteDictionary} from '../http'
import {ROUTES} from "../constants";
import {Context} from "../index";

import Dropdown from '../components/Dropdown'
import Friends from "../modals/Friends";

import '../styles/Dictionaries.css';
import '../styles/ItemList.css';

import LayersIcon from '@mui/icons-material/Layers';

const DictionariesPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const navigate = useNavigate()

    const [data, setData] = useState([])
    // const [data, setData] = useState([{id: 1, name: 'Halo?'}, {id: 2, name: 'No Halo!'}])
    const [name, setName] = useState('')
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const dropdownListFunc = (id) => [
        {message: 'Share', action: () => setShowFriendsModal(true)},
        {message: 'Delete', action: () => deleteCurrentDictionary(id)},
    ]


    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        getDictionaries(userId).then((response) => {
            setData(response.data.reverse())
        })
    }

    const newDictionary = async () => {
        const newDictionary = await createDictionary({userId, name})
        setData(prevState => [newDictionary.data, ...prevState])
        setName('')
    }

    const openDictionary = async (dictionaryId) => {
        navigate(ROUTES.ENTRIES + '/' + dictionaryId)
    }

    const deleteCurrentDictionary = async (dictionaryId) => {
        setData([...data.filter(item => item.id !== dictionaryId)])
        await deleteDictionary(userId, dictionaryId)
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
                            <Dropdown style={'item-dropdown'} items={dropdownListFunc(item.id)} icon={'Options'}/>
                        </div>

                        <Friends
                            itemId={item.id}
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
