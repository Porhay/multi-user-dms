import React, {useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";

import {createDictionary, getDictionaries} from '../http'
import {ROUTES} from "../constants";


const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'


const DictionariesPage = () => {
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
        <Container className="d-flex flex-column">
            <Form>
                <Form.Control
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={"Type dictionary name here..."}
                />
            </Form>
            <Button variant="outline-success" onClick={newDictionary}>New Dictionary</Button>

            <ListGroup>
                {data.map((item) => {
                    return (
                        <ListGroup.Item key={item.id} action onClick={() => openDictionary(item.id)}>
                            {item.name}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>

        </Container>
    )
}

export default DictionariesPage
