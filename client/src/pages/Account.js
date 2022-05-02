import React, {useContext, useState} from "react"
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {addFriendByName, getFriendByName} from "../http"
import {TextButton} from "../lib/Buttons"
import {Form, FormInput, FormInputExplanation, FormTitle} from "../lib/Forms"
import '../styles/Account.css'
import LayersIcon from "@mui/icons-material/Layers";
import '../styles/Lists.css';


const AccountPage = observer(() => {
    const context = useContext(Context)
    const user = context.user.user

    const [foundFriends, setFoundFriends] = useState([{id: 1, name: 'Diachick'}, {id: 2, name: 'Vlad'}])
    const [search, setSearch] = useState('')

    const searchForFriendByName = async (name) => {
        const result = await getFriendByName(user.id, name)
        setFoundFriends(result.data)
        setSearch('')
    }

    const addNewFriend = async (name) => {
        await addFriendByName(user.id, name)
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
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <FormInputExplanation text="Search for friends to share your dictionaries with them later" />
                    </Form>
                    <TextButton style={{marginTop: 25}} onClick={() => searchForFriendByName(search)} text="Search" />
                </div>

                <div style={{marginTop: 12, width:'100%'}}>
                    {foundFriends.map((item) => (
                        <div onClick={() => addNewFriend(item.name)} className="list-item-div" >
                            <div className="list-item-left">
                                <LayersIcon className="list-item-icon"/>
                                <a key={item.id} className="list-item-a">
                                    {item.name}
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
