import React, {useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {createEntry, getEntries} from "../http";
import {useParams} from 'react-router-dom';

import '../styles/Form.css';



const EntriesPage = () => {
    const {id: dictionaryId} = useParams() // dictionaryId
    const userId = 'random'

    const [data, setData] = useState([])
    const updateData = (userId, dictionaryId) => {
        getEntries(userId, dictionaryId).then((response) => {
            setData(response.data)
        })
    }

    useEffect(() => {
        // TODO fix userId
        updateData(userId, dictionaryId)
    }, [])


    const [key, setKey] = useState('')
    const [value, setValue] = useState('')
    const newEntry = async () => {
        await createEntry({userId, dictionaryId, key, value})
        setKey('')
        setValue('')
        updateData(userId, dictionaryId)
    }

    // TODO Fix ListGroup.Item output, make cards
    return (
        <Container className="d-flex flex-column w-75">
            <Container className="d-flex mt-5 mb-1">
                <Form
                    className="d-flex flex-row w-100"
                >
                    <Form.Control
                        size="md"
                        value={key}
                        onChange={e => setKey(e.target.value)}
                        placeholder={"Name"}
                    />
                    <Form.Control
                        size="md"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Value"}
                    />
                </Form>
                <Button size="md" variant="outline-success" onClick={newEntry}>New</Button>
            </Container>
            <Container className="d-flex flex-row">
                <ListGroup className="w-100">
                    {data.map((item) => {
                        return (
                            <ListGroup.Item key={item.id}>
                                <h6 className="mb-0">{item.key}</h6>
                                <div className="div">{item.value}</div>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Container>
        </Container>
    )
}

export default EntriesPage
