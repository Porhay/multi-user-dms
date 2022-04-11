import React, {useState} from 'react'
import axios from 'axios'
import {Button, Container, Form} from 'react-bootstrap'

const DictionariesPage = () => {

    const [word, setWord] = useState('')
    const [value, setValue] = useState('')


    const [randomWord, setRandomWord] = useState('halo')


    const host = axios.create({
        baseURL: 'http://localhost:8000',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
    })


    const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
    const dictionaryId = '726d6368-80bd-4820-9d11-bc43fc215d47'
    const createCard = async () => {
        await host.post(`/users/${userId}/dictionaries/${dictionaryId}/cards/`, {key: word, value})
        setWord('')
        setValue('')
    }

    const getRandomOne = async () => {
        const res = await host.get(`/random/${dictionaryId}`)
        setRandomWord(res.data.key)
    }




        return (
        <Container className="d-flex flex-column">
            <Form>
                <Form.Control
                    value={word}
                    onChange={e => setWord(e.target.value)}
                    placeholder={"Word"}
                />
                <Form.Control
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Value"}
                />
            </Form>
            <Button variant="outline-success" onClick={createCard}>Добавить</Button>
            <Button variant="outline-warning" onClick={getRandomOne}>Random</Button>
            <h2 className="m-auto">{randomWord}</h2>
        </Container>
    )
}

export default DictionariesPage
