import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {observer} from "mobx-react-lite";

import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {createEntry, getEntries, deleteEntry} from "../http";
import {Context} from "../index";


const EntriesPage = observer(() => {
    const {id: dictionaryId} = useParams()
    const context = useContext(Context)
    const user = context.user.user

    // Global state
    const [state, setState] = useState({
        key: '',
        value: '',
    })

    // All entries data
    const [data, setData] = useState([])

    const updateData = (userId, dictionaryId) => {
        getEntries(userId, dictionaryId).then((response) => {
            setData(response.data.reverse())
        })
    }

    useEffect(() => {
        updateData(user.id, dictionaryId)
    }, [])


    const createNewEntry = async () => {
        const data = {
            userId: user.id,
            dictionaryId,
            key: state.key,
            value: state.value
        }
        const newEntry = await createEntry(data)
        setData(prevState => [newEntry.data, ...prevState])
        setState({...state, key: '', value: ''})
    }


    const deleteCurrentEntry = async (entryId) => {
        const response = await deleteEntry(user.id, dictionaryId, entryId).catch(e => console.log(e))
        setData([...data.filter(item => item.id !== response.data.id)])
    }

    return (
        <Container className="d-flex flex-column w-75">
            <Container className="d-flex mt-5 mb-1">
                <Form
                    className="d-flex flex-row w-100"
                >
                    <Form.Control
                        size="md"
                        value={state.key}
                        onChange={e => setState({...state,  key: e.target.value})}
                        placeholder={"Name"}
                    />
                    <Form.Control
                        size="md"
                        value={state.value}
                        onChange={ e => setState({...state,  value: e.target.value})}
                        placeholder={"Value"}
                    />
                </Form>
                <Button size="md" variant="outline-success" onClick={createNewEntry}>New</Button>
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
