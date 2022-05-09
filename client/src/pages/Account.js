import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {addToFriendsByUsername, getByIdOrUsername} from "../http"
import {TextButton} from "../lib/Buttons"
import {Form, FormInput, FormInputExplanation, FormTitle} from "../lib/Forms"
import LayersIcon from "@mui/icons-material/Layers";
import '../styles/Account.css'
import '../styles/Lists.css';


const AccountPage = observer(() => {
    const context = useContext(Context)
    const user = context.user.user

    // Global state
    const [state, setState] = useState({
        friends: [],
        search: '',
    })

    const searchByUsername = async (username) => {
        const result = await getByIdOrUsername(username)
        console.log(result.data)
        setState({
            ...state,
            friends: [result.data],
            search: ''
        })
    }

    const addNewFriend = async (friendId) => {
        await addToFriendsByUsername(user.id, friendId)
    }

    return (
        <div className="account-container">
            <div className="account-position-container">
                <h2>Account page</h2>
                <hr style={{color: "black", backgroundColor: "black", height: 1, width:'100%'}} />

                <div style={{display:'flex'}}>
                    <Form style={{marginTop: 6, width: '100%'}}>
                        <FormTitle text="Search for friends"/>
                        <FormInput
                            value={state.search}
                            onChange={e => setState({...state, search: e.target.value})}
                        />
                        <FormInputExplanation text="Search for friends to share your dictionaries with them later" />
                    </Form>
                    <TextButton
                        style={{marginTop: 25}}
                        onClick={() => searchByUsername(state.search)}
                        text="Search"
                    />
                </div>

                <div style={{marginTop: 12, width:'100%'}}>
                    {state.friends.map((item) => (
                        <div
                            onClick={() => addNewFriend(item.id)}
                            className="list-item-div"
                        >
                            <div className="list-item-left">
                                <LayersIcon className="list-item-icon"/>
                                <a key={item.id} className="list-item-a">
                                    {item.name + ' ' + item.username}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
})

export default AccountPage;
