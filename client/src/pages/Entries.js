import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import {createEntry, getEntries, deleteEntry} from "../http";
import {Form, FormInput, FormTitle} from "../lib/Forms";
import {TextButton} from "../lib/Buttons";

import '../styles/Entries.css';
import '../styles/Lists.css';


const EntriesPage = observer(() => {
    const {id: dictionaryId} = useParams()
    const context = useContext(Context)
    const user = context.user.user

    // Global state
    const [state, setState] = useState({
        key: '',
        value: '',
    })

    // All entries data
    const [data, setData] = useState([])

    const updateData = (userId, dictionaryId) => {
        getEntries(userId, dictionaryId).then((response) => {
            setData(response.data.reverse())
        })
    }

    useEffect(() => {
        updateData(user.id, dictionaryId)
    }, [])


    const createNewEntry = async () => {
        const data = {
            userId: user.id,
            dictionaryId,
            key: state.key,
            value: state.value
        }
        const newEntry = await createEntry(data)
        setData(prevState => [newEntry.data, ...prevState])
        setState({...state, key: '', value: ''})
    }


    const deleteCurrentEntry = async (entryId) => {
        const response = await deleteEntry(user.id, dictionaryId, entryId).catch(e => console.log(e))
        setData([...data.filter(item => item.id !== response.data.id)])
    }

    return (
        <div className="entry-container">
            <div className="entry-position-container">
                <div style={{display: 'flex'}}>
                    <Form style={{marginTop: 6, width: '100%'}}>
                        <div style={{display: 'flex'}}>
                            <div style={{flexGrow: 1}}>
                                <FormTitle text="Name"/>
                                <FormInput
                                    value={state.key}
                                    onChange={e => setState({...state,  key: e.target.value})}
                                />
                            </div>
                            <div style={{flexGrow: 1}}>
                                <FormTitle text="Value"/>
                                <FormInput
                                    value={state.value}
                                    onChange={e => setState({...state,  value: e.target.value})}
                                />
                            </div>
                        </div>
                    </Form>
                    <TextButton style={{marginTop: 25}} onClick={() => createNewEntry()} text="New"/>
                </div>

                <div className="entry-sort-button-div">
                    <a onClick={() => {
                        const sortedData = data.sort((a, b) => a.key < b.key ? -1 : 1)
                        setData([...sortedData])
                    }}>
                        <span className="entry-sort-button-span">??? Sort by name</span>
                    </a>
                </div>

                <div className="entry-list-div">
                    {data.map((item) =>
                        <>
                            <div key={item.id} className="list-item-div">
                                <div className="entry-list-item-text">
                                    <h6 className="entry-list-item-h6">{item.key}</h6>
                                    <span className="entry-list-item-span">
                                        {item.value}
                                    </span>
                                </div>
                                <div className="entry-list-item-x" onClick={() => deleteCurrentEntry(item.id)}>x</div>
                            </div>

                        </>
                    )}
                </div>

            </div>
        </div>
    )
})

export default EntriesPage
