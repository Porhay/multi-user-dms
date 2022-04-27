import React, {useContext, useState} from "react"
import {Button, Container, Form, ListGroup} from "react-bootstrap";
import {observer} from "mobx-react-lite";

import {getFriend, addFriend} from "../http";
import {Context} from "../index";


const AccountPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const [foundFriends, setFoundFriends] = useState([])
    const [search, setSearch] = useState('')

    const searchForFriendName = async (name) => {
        const result = await getFriend(userId, name)
        setFoundFriends(result.data)
        setSearch('')
    }

    const addNewFriend = async (name) => {
        await addFriend(userId, name)
    }


    return (
        <Container className="d-flex flex-column w-50 mt-5 mb-2">
            <Form.Label className="bold">Search for friends</Form.Label>
            <Form
                className="d-flex flex-column w-100 mb-2"
            >
                <Form.Control
                    size="md"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={""}
                />
            </Form>
            <Button
                size="md"
                variant="outline-success"
                onClick={() => searchForFriendName(search)}
                className="w-25"
            >
                Search
            </Button>
            <ListGroup>
                {foundFriends.map(({id: friendId, name}) => {
                    return (
                        <ListGroup.Item
                            className="d-flex flex-row align-items-center justify-content-between"
                            key={friendId}
                            action
                            onClick={() => addNewFriend(userId, name)}
                        >
                            {name}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>

        </Container>
    )
})

export default AccountPage;

