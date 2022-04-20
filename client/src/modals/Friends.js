import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Form, ListGroup} from "react-bootstrap";
import {getFriends} from "../http";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Friends = observer(({show, onHide}) => {
    const {user} = useContext(Context)
    const userId = user.user.id


    const [friends, setFriends] = useState([])
    useEffect(() => {
        getFriends(userId).then(response => {
            console.log(response.data)
            setFriends(response.data)
        })
    }, [])


    const [search, setSearch] = useState('')
    const searchFriends = () => {
        console.log(search)
    }


    const shareDictionary = (id) => {


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
                    {friends.map(({id, name}) => {
                        return (
                                <ListGroup.Item
                                    className="d-flex flex-row align-items-center justify-content-between"
                                    key={id}
                                    action
                                    onClick={() => shareDictionary(id)}
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
