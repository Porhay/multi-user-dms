import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { ListGroup } from "react-bootstrap";
import { getFriends, sendNotification } from "../http";
import { baseURL } from "../config.js";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Friends = observer(({ item, show, onHide }) => {
    const context = useContext(Context)
    const user = context.user.user

    const [friends, setFriends] = useState([])
    useEffect(() => {
        getFriends(user.id).then(response => {
            setFriends(response.data)
        })
    }, [])


    const sendNotificationMessage = async (senderId, message, dictionaryId, recipientId) => {
        const senderImageUrl = user.userData.downloadUrl
        await sendNotification(senderId, message, dictionaryId, recipientId, senderImageUrl)
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
                <ListGroup>
                    {friends.map(({ id: friendId, name }) => {
                        return (
                            <ListGroup.Item
                                className="d-flex flex-row align-items-center justify-content-between"
                                key={friendId}
                                action
                                onClick={async () => {
                                    const message = `${user.userData.username} share dictionary '${item.name}' [${item.count}] for you!`
                                    await sendNotificationMessage(user.id, message, item.id, friendId)
                                }}
                            >
                                {name}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>

            </Modal.Body>
        </Modal>
    )
})

export default Friends;
