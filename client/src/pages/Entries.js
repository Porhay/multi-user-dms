import React, {useContext, useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import {observer} from "mobx-react-lite";

import {createEntry, getEntries, deleteEntry} from "../http";

import '../styles/Form.css';
import {Context} from "../index";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const EntriesPage = observer(() => {
    const {id: dictionaryId} = useParams() // dictionaryId

    const {user} = useContext(Context)
    const userId = user.user.id

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


    const deleteCurrentEntry = async (entryId) => {
        await deleteEntry(userId, dictionaryId, entryId)
        updateData(userId, dictionaryId)
    }

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
                            <ListGroup.Item key={item.id} className="d-flex flex-row">
                                <Container>
                                    <h6 className="mb-0">{item.key}</h6>
                                    <div className="div">{item.value}</div>
                                </Container>
                                <Button
                                    className="remove"
                                    size="sm"
                                    variant="link"
                                    onClick={() => deleteCurrentEntry(item.id)}
                                >
                                    <Container
                                        className="d-flex flex-row align-items-center justify-content-between"
                                        style={{color: 'black', opacity: 0.5}}
                                    >
                                        <DeleteOutlineIcon  />
                                        {/*<text style={{fontSize:'12'}}>Delete</text>*/}
                                    </Container>

                                </Button>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Container>
        </Container>
    )
})

export default EntriesPage
