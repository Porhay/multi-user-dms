import React, {useState} from 'react'
import {Button, Container, Card} from 'react-bootstrap'
import {getRandomOne} from '../http'


const RandomizerPage = () => {
    const [visible, setVisible] = useState('Halo :D')
    const [data, setData] = useState({})

    const dictionaryId = '90a45dd7-f531-4c46-9794-27410ef0ae58'
    const showRandomOne = async () => {
        const res = await getRandomOne(dictionaryId)
        setData(res.data)
        setVisible(res.data.key)
    }
    const showValue = async () => {
        setVisible(data.value)
    }

    return (
        <Container className="d-flex flex-column p-4 m-5">
            <Card className="text-center">
                <Card.Header>Randomizer</Card.Header>
                <Card.Body>
                    <Card.Title>{visible}</Card.Title>
                    <Button variant="primary" className="me-3" onClick={showRandomOne}>Next</Button>
                    <Button variant="secondary" onClick={showValue}>Value</Button>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card>
        </Container>
    )
}

export default RandomizerPage;
