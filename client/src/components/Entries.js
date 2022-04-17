import React, {useState} from 'react'
import {Button, Container, Form} from 'react-bootstrap'
import {createEntry} from '../http'


const Entries = () => {
    const [key, setKey] = useState('')
    const [value, setValue] = useState('')

    const newEntry = async () => {
        const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        const dictionaryId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        await createEntry({userId, dictionaryId, key, value})
        setKey('')
        setValue('')
    }

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
        </Container>
    )
}

export default Entries
