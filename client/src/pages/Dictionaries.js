import React, {useState} from 'react'
import {Button, Container, Form} from 'react-bootstrap'
import {createEntry, getRandomOne} from '../http'


const DictionariesPage = () => {

    const [key, setKey] = useState('')
    const [value, setValue] = useState('')
    const [randomWord, setRandomWord] = useState('halo')


    const create = async () => {
        await createEntry(key, value)
        setKey('')
        setValue('')
    }

    const showRandomOne = async () => {
        const res = await getRandomOne()
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
            <Button variant="outline-success" onClick={create}>Добавить</Button>
            <Button variant="outline-warning" onClick={showRandomOne}>Random</Button>
            <h2 className="m-auto">{randomWord}</h2>
        </Container>
    )
}

export default DictionariesPage
