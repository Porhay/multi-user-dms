import React, {useContext, useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {createDictionary, getDictionaries} from '../http'
import {ROUTES} from "../constants";
import {Context} from "../index";

import '../styles/Form.css';


// const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'


const DictionariesPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [name, setName] = useState('')

    useEffect(() => {
        updateData(userId)
    }, [])

    const updateData = (userId) => {
        getDictionaries(userId).then((response) => {
            setData(response.data)
        })
    }

    const newDictionary = async () => {
        await createDictionary({userId, name})
        updateData(userId)
        setName('')
    }

    const openDictionary = async (dictionaryId) => {
        navigate(ROUTES.ENTRIES + '/' + dictionaryId)
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
            <Container
                className="justify-content-center"
            >
                <ListGroup>
                    {data.map((item) => {
                        return (
                            <ListGroup.Item
                                size="sm"
                                key={item.id}
                                action
                                onClick={() => openDictionary(item.id)}
                            >
                                {item.name}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Container>
        </Container>
    )
})

export default DictionariesPage
