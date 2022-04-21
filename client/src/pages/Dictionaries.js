import React, {useContext, useEffect, useState} from 'react'
import {Button, ButtonGroup, Container, DropdownButton, Dropdown, Form, ListGroup} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {createDictionary, getDictionaries, deleteDictionary} from '../http'
import {ROUTES} from "../constants";
import {Context} from "../index";

import Friends from "../modals/Friends";

import '../styles/Form.css';


// const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
const DictionariesPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [name, setName] = useState('')

    const [showFriendsModal, setShowFriendsModal] = useState(false);

    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        getDictionaries(userId).then((response) => {
            setData(response.data)
        })
    }

    const newDictionary = async () => {
        await createDictionary({userId, name})
        updateData()
        setName('')
    }

    const openDictionary = async (dictionaryId) => {
        navigate(ROUTES.ENTRIES + '/' + dictionaryId)
    }

    const deleteCurrentDictionary = async (dictionaryId) => {
        await deleteDictionary(userId, dictionaryId)
        updateData()
        // TODO this is an invalid way, remove after ui fix
        navigate(ROUTES.DICTIONARIES)
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
                <ListGroup>
                    {data.map((item) => {
                        return (
                            <Container className="d-flex flex-row w-100">
                                <ListGroup.Item
                                    className="d-flex flex-row align-items-center justify-content-between"
                                    key={item.id}
                                    action
                                    onClick={() => openDictionary(item.id)}
                                >
                                    <div className="bold">{item.name}</div>
                                    <Button
                                        className="remove"
                                        size="sm"
                                        variant="link"
                                        onClick={() => deleteCurrentDictionary(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </ListGroup.Item>
                                {[DropdownButton].map((DropdownType, idx) => (
                                    <DropdownType
                                        as={ButtonGroup}
                                        key={idx}
                                        id={`dropdown-button-drop-${idx}`}
                                        size="sm"
                                        variant="secondary"
                                        title="Friends"
                                    >
                                        <Dropdown.Item
                                            onClick={() => setShowFriendsModal(true)}
                                            eventKey="1">
                                            Share
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => console.log(``)}
                                            eventKey="2">
                                            Delete
                                        </Dropdown.Item>
                                    </DropdownType>
                                ))}
                                <Friends
                                    dictionaryId={item.id}
                                    show={showFriendsModal}
                                    onHide={() => {
                                        console.log(`Словарь outer: ${item.id}`)
                                        setShowFriendsModal(false)}
                                    }
                                />
                            </Container>
                        )
                    })}
                </ListGroup>
            </Container>
        </Container>
    )
})

export default DictionariesPage
