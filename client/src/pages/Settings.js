import React, {useContext, useState} from "react"
import {Button, Container, Form} from "react-bootstrap";

import {updateProfile} from "../http";
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const SettingsPage = observer(() => {
    const {user} = useContext(Context)
    const userId = user.user.id

    const [name, setName] = useState('')

    const updateUserProfile = async (name) => {
        const fields = {name}
        await updateProfile(userId, fields)
        setName('')
    }


    return (
        <Container className="d-flex flex-column w-50 mt-5 mb-2">
            <Form.Label className="bold">Name</Form.Label>
            <Form
                className="d-flex flex-column w-100 mb-2"
            >
                <Form.Control
                    size="md"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={""}
                />
            </Form>
            <Button
                size="md"
                variant="outline-success"
                onClick={() => updateUserProfile(name)}
                className="w-25"
            >
                Update profile
            </Button>
        </Container>
    )
})

export default SettingsPage;

