import React, {useState} from 'react'
import {Button, Container, Form} from 'react-bootstrap'
import {createEntry, getRandomOne} from '../http'


const DictionariesPage = () => {

    const [key, setKey] = useState('')
    const [value, setValue] = useState('')
    const [randomWord, setRandomWord] = useState('Halo :D')


    const newEntry = async () => {
        const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        const dictionaryId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        await createEntry({userId, dictionaryId, key, value})
        setKey('')
        setValue('')
    }

    const showRandomOne = async () => {
        const dictionaryId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        const res = await getRandomOne(dictionaryId)
        setRandomWord(res.data.key)
    }

    return (
        <Container className="d-flex flex-column">
            <Form>
                <Form.Control
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    placeholder={"Word"}
                />
                <Form.Control
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Value"}
                />
            </Form>
            <Button variant="outline-success" onClick={newEntry}>Добавить</Button>
            <Button variant="outline-warning" onClick={showRandomOne}>Random</Button>
            <h2 className="m-auto">{randomWord}</h2>
        </Container>
    )
}

export default DictionariesPage
