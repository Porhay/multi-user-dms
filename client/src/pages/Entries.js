import React, {useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {createEntry, getEntries} from "../http";
import {useParams} from 'react-router-dom';


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
        <Container className="d-flex flex-column">
            <Form>
                <Form.Control
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    placeholder={"Type entry name here..."}
                />
                <Form.Control
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Type entry value here..."}
                />
            </Form>
            <Button variant="outline-success" onClick={newEntry}>New Entry</Button>

            <ListGroup>
                {data.map((item) => {
                    return (
                        <ListGroup.Item key={item.id}>
                            {item.key}  ===> {item.value}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </Container>
    )
}

export default EntriesPage
