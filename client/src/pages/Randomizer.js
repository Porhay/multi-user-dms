import React, {useState} from 'react'
import {Button, Container, Card} from 'react-bootstrap'
import {getRandomOne} from '../http'


const RandomizerPage = () => {
    const [randomWord, setRandomWord] = useState('Halo :D')

    const showRandomOne = async () => {
        const dictionaryId = '726d6368-80bd-4820-9d11-bc43fc215d47'
        const res = await getRandomOne(dictionaryId)
        setRandomWord(res.data.key)
    }

    return (
        <Container className="d-flex flex-column p-4 m-5">
            <Card className="text-center">
                <Card.Header>Randomizer</Card.Header>
                <Card.Body>
                    <Card.Title>Click the button to randomize your dictionary entries</Card.Title>
                    <Card.Text>
                        {randomWord}
                    </Card.Text>
                    <Button variant="primary" onClick={showRandomOne}>Next</Button>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card>
        </Container>
    )
}

export default RandomizerPage;
