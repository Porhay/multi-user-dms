import React, {useEffect, useState} from 'react'
import {Container, ListGroup} from 'react-bootstrap'
import { getEntries } from "../http";
import { useParams } from 'react-router-dom';


const EntriesPage = () => {
    const {id} = useParams()

    const [data, setData] = useState([])
    const updateData = (userId, dictionaryId) => {
        getEntries(userId, dictionaryId).then((response) => {
            setData(response.data)
        })
    }

    useEffect(() => {
        // TODO fix userId
        updateData('random', id)
    }, [])


    return (
        <Container className="d-flex flex-column">
            <ListGroup>
                {data.map((item) => {
                    return (
                        <ListGroup.Item key={item.id}>
                            {item.key}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </Container>
    )
}

export default EntriesPage
