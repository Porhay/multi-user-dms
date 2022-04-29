import React, {useContext, useState} from "react"
import {Button, Container, Form, ListGroup} from "react-bootstrap";
import {observer} from "mobx-react-lite";

import {addFriendByName, getFriendByName} from "../http";
import {Context} from "../index";


const AccountPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const [foundFriends, setFoundFriends] = useState([{id: 1, name: 'Vlad'}])
    const [search, setSearch] = useState('')

    const searchForFriendByName = async (name) => {
        const result = await getFriendByName(userId, name)
        setFoundFriends(result.data)
        setSearch('')
    }

    const addNewFriend = async (name) => {
        await addFriendByName(userId, name)
    }


    return (
        <Container className="d-flex flex-column w-50 mt-5">
            <Form.Label className="bold">Search for friends</Form.Label>
            <Container className="d-flex flex-row mb-2">
                <Form className="w-100">
                    <Form.Control
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={""}
                    />
                </Form>
                <Button onClick={() => searchForFriendByName(search)}>Search</Button>
            </Container>
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

