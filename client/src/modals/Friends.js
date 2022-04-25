import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Form, ListGroup} from "react-bootstrap";
import {getFriends, sendNotification, shareDictionary} from "../http";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Friends = observer(({itemId, show, onHide}) => {
    const {user} = useContext(Context)
    const userId = user.user.id


    const [friends, setFriends] = useState([])
    useEffect(() => {
        getFriends(userId).then(response => {
            setFriends(response.data)
        })
    }, [])


    const [search, setSearch] = useState('')
    const searchFriends = () => {
        console.log(search)
    }


    const shareCurrentDictionary = async (recipientId) => {
        await shareDictionary(userId, itemId, recipientId)
        onHide()
    }


    const sendNotificationMessage = async (message) => {
        await sendNotification(message)
        onHide()
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Friends
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        className="mb-1"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={"Search for friends..."}
                    />
                </Form>

                <ListGroup>
                    {friends.map(({id:friendId, name}) => {
                        return (
                                <ListGroup.Item
                                    className="d-flex flex-row align-items-center justify-content-between"
                                    key={friendId}
                                    action
                                    onClick={() => shareCurrentDictionary(friendId)}
                                    // onClick={() => sendNotificationMessage('halo')}
                                >
                                    {name}
                                </ListGroup.Item>
                        )
                    })}
                </ListGroup>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                {/*<Button variant="outline-success" onClick={shareDictionary}>Share</Button>*/}
            </Modal.Footer>
        </Modal>
    )
})

export default Friends;
