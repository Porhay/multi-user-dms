import React, {useContext, useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {ButtonGroup} from "@mui/material";

import {createDictionary, getDictionaries, deleteDictionary} from '../http'
import Friends from "../modals/Friends";
import {ROUTES} from "../constants";
import {Context} from "../index";

import Dropdown from '../components/Dropdown'


// const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
const DictionariesPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const navigate = useNavigate()

    const [data, setData] = useState([{id: 1, name:'Halo?'}])
    const [name, setName] = useState('')

    const dropdownListFunc = (id) => {
        return [
            {message: 'Share', action: () => setShowFriendsModal(true)},
            {message: 'Delete', action: () => deleteCurrentDictionary(id)},
        ]
    }

    const [showFriendsModal, setShowFriendsModal] = useState(false);

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
                <ListGroup>
                    {data.map((item) => {
                        return (
                            <Container className="d-flex flex-row align-items-center">
                                <ListGroup.Item
                                    key={item.id}
                                    onClick={() => openDictionary(item.id)}
                                    action
                                >
                                    <div className="bold">{item.name}</div>
                                </ListGroup.Item>

                                <Dropdown items={dropdownListFunc(item.id)} icon={'Halo'} />

                                {/*{[DropdownButton].map((DropdownType, idx) => {*/}
                                {/*    return (*/}
                                {/*        <DropdownType*/}
                                {/*            as={ButtonGroup}*/}
                                {/*            key={idx}*/}
                                {/*            id={`dropdown-button-drop-${idx}`}*/}
                                {/*            title="Friends"*/}
                                {/*        >*/}
                                {/*            <Dropdown.Item*/}
                                {/*                onClick={() => setShowFriendsModal(true)}*/}
                                {/*                eventKey="1"*/}
                                {/*            >*/}
                                {/*                <Friends*/}
                                {/*                    itemId={item.id}*/}
                                {/*                    show={showFriendsModal}*/}
                                {/*                    onHide={() => setShowFriendsModal(false)}*/}
                                {/*                />*/}
                                {/*                Share*/}
                                {/*            </Dropdown.Item>*/}
                                {/*            <Dropdown.Item*/}
                                {/*                onClick={() => deleteCurrentDictionary(item.id)}*/}
                                {/*                eventKey="2"*/}
                                {/*            >*/}
                                {/*                Delete*/}
                                {/*            </Dropdown.Item>*/}
                                {/*        </DropdownType>*/}
                                {/*    )*/}
                                {/*})*/}
                                {/*}*/}
                            </Container>
                        )
                    })}
                </ListGroup>
            </Container>
        </Container>
    )
})

export default DictionariesPage
