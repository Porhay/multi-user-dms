import React, {useState} from 'react'
import {Button, Container, Form} from 'react-bootstrap'
import {createDictionary} from '../http'


const Dictionaries = () => {
    const [data, setData] = useState('')
    const [value, setValue] = useState('')

    const newDictionary = async () => {
        const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        await createDictionary({userId, value})
    }

    return (
        <Container className="d-flex flex-column">
            <Form>
                <Form.Control
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Type dictionary name here..."}
                />
            </Form>
            <Button variant="outline-success" onClick={newDictionary}>New Dictionary</Button>
        </Container>
    )
}

export default Dictionaries
