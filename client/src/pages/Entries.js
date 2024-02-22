import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";

import { Context } from "../index";
import { createEntry, getEntries, deleteEntry } from "../http";
import { Form, FormInput, FormTitle } from "../lib/Forms";
import { TextButton } from "../lib/Buttons";

import '../styles/Entries.css';
import '../styles/Lists.css';


const EntriesPage = observer(() => {
    const { id: dictionaryId } = useParams()
    const context = useContext(Context)
    const user = context.user.user

    // Global state
    const [state, setState] = useState({
        key: '',
        value: '',
        narrowingArr: [],
        rootData: [],
        showValue: true,
    })

    // data = {visible:[], root:[]} // FIXME
    const [data, setData] = useState([]) // All entries data

    const updateData = (userId, dictionaryId) => {
        getEntries(userId, dictionaryId).then((response) => {
            const data = response.data.reverse()
            setState({ ...state, rootData: data, narrowingArr: data }) // update random words list on reload
            setData(data)
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
        setState({ ...state, key: '', value: '', rootData: [...state.rootData, newEntry.data] })
    }


    const deleteCurrentEntry = async (entryId) => {
        const response = await deleteEntry(user.id, dictionaryId, entryId).catch(e => console.log(e))
        setData([...data.filter(item => item.id !== response.data.id)])
        setState({ ...state, rootData: [...data.filter(item => item.id !== response.data.id)] })
    }

    const handleCreateNewEntry = async () => {
        if (state.key !== '' && state.value !== '') {
            await createNewEntry()
        }
    }

    return (
        <div className="entry-container">
            <div className="entry-position-container">
                <div style={{ display: 'flex' }}>
                    <Form style={{ marginTop: 6, width: '100%' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flexGrow: 1 }}>
                                <FormTitle text="Name" />
                                <FormInput
                                    value={state.key}
                                    onChange={e => setState({ ...state, key: e.target.value })}
                                    onKeyDown={handleCreateNewEntry}
                                />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <FormTitle text="Value" />
                                <FormInput
                                    value={state.value}
                                    onChange={e => setState({ ...state, value: e.target.value })}
                                    onKeyDown={handleCreateNewEntry}
                                />
                            </div>
                        </div>
                    </Form>
                    <TextButton style={{ marginTop: 25 }} onClick={handleCreateNewEntry} text="New" />
                </div>

                <div className="entry-sort-button-div">
                    <a onClick={() => {
                        const sortedData = state.rootData.sort((a, b) => a.key < b.key ? -1 : 1)
                        setData([...sortedData])
                    }}>
                        <span className="entry-sort-button-span">→ Sort by name</span>
                    </a>

                    <a onClick={() => {
                        let { narrowingArr } = state
                        if (narrowingArr.length === 0) {
                            narrowingArr = state.rootData
                            setState({ ...state, narrowingArr })
                        }

                        const randomOne = narrowingArr[Math.floor(Math.random() * narrowingArr.length)]
                        setData([randomOne]) // show one word
                        setState({ ...state, narrowingArr: narrowingArr.filter(item => item !== randomOne) }) // decrease narrowingArr
                    }}>
                        <span className="entry-sort-button-span">→ Random one</span>
                    </a>
                </div>

                <div className="entry-list-div">
                    {data.map((item) =>
                        <>
                            <div key={item.id} className="list-item-div" onClick={() => {
                                setState({ ...state, showValue: !state.showValue })
                            }}>
                                <div className="entry-list-item-text">
                                    <h6 className="entry-list-item-h6">{item.key}</h6>
                                    <span className="entry-list-item-span" >
                                        {state.showValue ? item.value : '*****'}
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
