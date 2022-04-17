import React, {useEffect, useState} from 'react'
import {Button, Container, Form, ListGroup} from 'react-bootstrap'
import {createDictionary, getDictionaries} from '../http'


const Dictionaries = () => {
    const [data, setData] = useState([])
    const [name, setName] = useState('')

    const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
    const newDictionary = async () => {
        await createDictionary({userId, name})
        setName('')

        let response = await getDictionaries(userId)
        setData(response.data)
    }

    const alertClicked = async (dictionaryId) => {
        alert(`You clicked ${dictionaryId}`)
    }

    // TODO investigate useEffect fetch
    // useEffect(async () => {
    //     let response = await getDictionaries(userId)
    //     setData(response.data)
    // })

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

            <ListGroup defaultActiveKey="#link1">
                {data.map((item) => {
                    return (
                        <ListGroup.Item key={item.id} action onClick={() => alertClicked(item.id)}>
                            {item.name}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>

        </Container>
    )
}

export default Dictionaries
