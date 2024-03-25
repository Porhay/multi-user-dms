import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";

import { Context } from "../index";
import { createEntry, getEntries, deleteEntry, updateEntry, getDictionary } from "../http";
import { Form, FormInput, FormTitle } from "../lib/Forms";
import { TextButton } from "../lib/Buttons";
import { nextColor } from '../helpers'

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SquareTwoToneIcon from '@mui/icons-material/SquareTwoTone'; import '../styles/Entries.css';
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
        dictionary: null,
        showValue: true,
        color: 'green', // green, purple, yellow, red
    })

    // data = {visible:[], root:[]} // FIXME
    const [data, setData] = useState([]) // All entries data



    useEffect(() => {
        const _fetchData = async (userId, dictionaryId) => {
            const response = await getEntries(userId, dictionaryId)
            const data = [...response.data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            const dictionary = await getDictionary(user.id, dictionaryId)
            setState({ ...state, rootData: data, narrowingArr: data, dictionary: dictionary }) // update random words list on reload
            setData(data)
        }
        _fetchData(user.id, dictionaryId)
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
        setState({
            ...state,
            key: '',
            value: '',
            rootData: [...state.rootData, newEntry.data],
            dictionary: { ...state.dictionary, count: state.dictionary.count + 1 },
        })
    }

    const handleUpdateEntry = async (entryId, dataObject) => {
        const entryToUpdate = state.rootData.find(entry => entry.id === entryId)

        const context = { color: null }
        context.color = entryToUpdate.color ? null : dataObject.color // remove if exist

        const updatedEntry = await updateEntry(user.id, dictionaryId, entryId, context)
        data.find(entry => entry.id === updatedEntry.id).color = updatedEntry.color
        setData([...data])
    }

    const deleteCurrentEntry = async (entryId) => {
        const response = await deleteEntry(user.id, dictionaryId, entryId).catch(e => console.log(e))
        const actualEntries = [...data.filter(item => item.id !== response.data.id)]
        setData(actualEntries)
        setState({
            ...state,
            rootData: actualEntries,
            dictionary: { ...state.dictionary, count: state.dictionary.count - 1 },
        })
    }

    const handleCreateNewEntry = async () => {
        if (state.key !== '') {
            await createNewEntry()
        }
    }

    return (
        <div className="entry-container">
            <div className="entry-position-container">
                <div style={{ display: 'flex' }}>
                    <Form style={{ marginTop: 5, width: '100%' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flexGrow: 1 }}>
                                <FormTitle text="Caption" />
                                <FormInput
                                    value={state.key}
                                    onChange={e => setState({ ...state, key: e.target.value })}
                                    onKeyDown={handleCreateNewEntry}
                                />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <FormTitle text="Value(optional)" />
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
                    <div className="list-item-div background-black color-white">
                        <div className="entry-list-item-text ">
                            <h6 style={{ fontWeight: 600 }} className={`entry-list-item-h6 onlyKey`}>
                                {`${state.dictionary ? state.dictionary.name + ' (' + state.dictionary.count + ')' : 'Title'}`}
                            </h6>
                        </div>
                        <div style={{ paddingBottom: 5 }} className="entry-action-buttons">
                            <div className="entry-action-color-button" onClick={() => {
                                const color = nextColor(state.color)
                                setState({ ...state, color: color })
                            }}>
                                <SquareTwoToneIcon className={`color-${state.color}`} />
                            </div>
                            <div className="entry-list-item-x" >
                                <CloseOutlinedIcon style={{ opacity: 0 }} className='entry-delete-icon' />
                            </div>
                        </div>
                    </div>
                    {data.map((item) =>
                        <>
                            <div key={item.id} className={`list-item-div ${`background-${item.color}` || ''}`}>
                                <div className="entry-list-item-text" onClick={() => {
                                    setState({ ...state, showValue: !state.showValue })
                                }}>
                                    <h6 className={`entry-list-item-h6 ${item.value ? '' : 'onlyKey'}`}>{item.key}</h6>
                                    <span className="entry-list-item-span" >
                                        {state.showValue ? item.value : '*****'}
                                    </span>
                                </div>
                                <div style={{ paddingBottom: 5 }} className="entry-action-buttons">
                                    <div className="entry-action-color-button" onClick={() => {
                                        handleUpdateEntry(item.id, { color: state.color })
                                    }}>
                                        <DoneOutlinedIcon className='entry-action-color-icon' />
                                    </div>
                                    <div className="entry-list-item-x" onClick={() => deleteCurrentEntry(item.id)}>
                                        <CloseOutlinedIcon className='entry-delete-icon' />
                                    </div>
                                </div>
                            </div>

                        </>
                    )}
                </div>

            </div>
        </div>
    )
})

export default EntriesPage
