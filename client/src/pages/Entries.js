import {
  createEntry,
  getEntries,
  deleteEntry,
  updateEntry,
  getDictionary,
} from '../http';
import '../styles/Entries.css';
import '../styles/Lists.css';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { Form, FormInput, FormTitle } from '../lib/Forms';
import { TextButton } from '../lib/Buttons';
import { nextColor } from '../helpers';
import { Dropdown } from '../components/Dropdown';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import SquareTwoToneIcon from '@mui/icons-material/SquareTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const EntriesPage = observer(() => {
  const { id: dictionaryId } = useParams();
  const context = useContext(Context);
  const user = context.user.user;

  // LOCAL STATE
  const [state, setState] = useState({
    key: '',
    value: '',
    editKey: '',
    editValue: '',
    narrowingArr: [],
    rootData: [],
    dictionary: null,
    showValue: true,
    color: 'green', // green, purple, yellow, red, blue
  });

  // data = {visible:[], root:[]} // FIXME
  const [data, setData] = useState([]); // All entries data


  // DATA SETS
  const entryDropdown = (item) => [
    {
      message: 'Update', action: () => setEntryUpdate(item, true)
    },
    { message: 'Delete', action: () => deleteCurrentEntry(item.id) },
  ];
  const entriesPanelDotsDropdown = () => [
    { message: 'Hide all', action: () => setState({ ...state, showValue: !state.showValue }) },
  ];


  // USE EFFECT
  useEffect(() => {
    const _fetchData = async (userId, dictionaryId) => {
      const response = await getEntries(userId, dictionaryId);
      const data = [...response.data].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
      const dictionary = await getDictionary(user.id, dictionaryId);
      setState({
        ...state,
        rootData: data,
        narrowingArr: data,
        dictionary: dictionary,
      }); // update random words list on reload
      setData(data);
    };

    // update with falsy edit value by default
    for (const entry of data) {
      entry.isEdit = false;
    }
    setData(data);

    _fetchData(user.id, dictionaryId);
  }, []);


  // FUNCTIONS
  const createNewEntry = async () => {
    const data = {
      userId: user.id,
      dictionaryId,
      key: state.key,
      value: state.value,
    };
    const newEntry = await createEntry(data);
    setData((prevState) => [newEntry.data, ...prevState]);
    setState({
      ...state,
      key: '',
      value: '',
      rootData: [...state.rootData, newEntry.data],
      dictionary: { ...state.dictionary, count: state.dictionary.count + 1 },
    });
  };

  const handleUpdateEntry = async (entryId, dataObj) => {
    const context = {};

    if (dataObj.key !== null) {
      context.key = dataObj.key;
    }
    if (dataObj.value !== null) {
      context.value = dataObj.value;
    }

    if (Object.keys(context).length === 0) {
      return
    }

    const updatedEntry = await updateEntry(user.id, dictionaryId, entryId, context);
    data.find((entry) => entry.id === updatedEntry.id).key = updatedEntry.key;
    data.find((entry) => entry.id === updatedEntry.id).value = updatedEntry.value;
    data.find((entry) => entry.id === updatedEntry.id).isEdit = false;

    setData([...data]);
  };

  // TODO: fix! merge with handleUpdateEntry
  const handleUpdateEntryColor = async (entryId, dataObject) => {
    const entryToUpdate = state.rootData.find((entry) => entry.id === entryId);

    const context = { color: null };
    context.color = entryToUpdate.color ? null : dataObject.color; // remove if exist

    const updatedEntry = await updateEntry(
      user.id,
      dictionaryId,
      entryId,
      context,
    );
    data.find((entry) => entry.id === updatedEntry.id).color = updatedEntry.color;
    setData([...data]);
  };

  const deleteCurrentEntry = async (entryId) => {
    const response = await deleteEntry(user.id, dictionaryId, entryId).catch(
      (e) => console.log(e),
    );
    const actualEntries = [
      ...data.filter((item) => item.id !== response.data.id),
    ];
    setData(actualEntries);
    setState({
      ...state,
      rootData: actualEntries,
      dictionary: { ...state.dictionary, count: state.dictionary.count - 1 },
    });
  };

  const handleCreateNewEntry = async () => {
    if (state.key !== '') {
      await createNewEntry();
    }
  };

  const setEntryUpdate = (item, isActive) => {
    setData([...data.filter(i => i !== item), { ...item, isEdit: isActive }].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)))
    setState({ ...state, editKey: item.key, editValue: item.value })
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
                  onChange={(e) => setState({ ...state, key: e.target.value })}
                  onKeyDown={handleCreateNewEntry}
                />
              </div>
              <div style={{ flexGrow: 1 }}>
                <FormTitle text="Value(optional)" />
                <FormInput
                  value={state.value}
                  onChange={(e) => setState({ ...state, value: e.target.value })}
                  onKeyDown={handleCreateNewEntry}
                />
              </div>
            </div>
          </Form>
          <TextButton
            style={{ marginTop: 25 }}
            onClick={handleCreateNewEntry}
            text="New"
          />
        </div>

        <div className="entry-sort-button-div">
          <a
            onClick={() => {
              const sortedData = state.rootData.sort((a, b) =>
                a.key < b.key ? -1 : 1,
              );
              setData([...sortedData]);
            }}
          >
            <span className="entry-sort-button-span">→ Sort by name</span>
          </a>

          <a
            onClick={() => {
              let { narrowingArr } = state;
              if (narrowingArr.length === 0) {
                narrowingArr = state.rootData;
                setState({ ...state, narrowingArr });
              }

              const randomOne =
                narrowingArr[Math.floor(Math.random() * narrowingArr.length)];
              setData([randomOne]); // show one word
              setState({
                ...state,
                narrowingArr: narrowingArr.filter((item) => item !== randomOne),
              }); // decrease narrowingArr
            }}
          >
            <span className="entry-sort-button-span">→ Random one</span>
          </a>
        </div>

        <div className="entry-list-div">
          <div className="list-item-div background-black color-white">
            <div className="entry-list-item-text ">
              <h6
                style={{ fontWeight: 600 }}
                className={`entry-list-item-h6 onlyKey`}
              >
                {`${state.dictionary ? state.dictionary.name + ' (' + state.dictionary.count + ')' : 'Title'}`}
              </h6>
            </div>
            <div style={{ paddingBottom: 5 }} className="entry-action-buttons">
              <div
                className="entry-action-color-button"
                onClick={() => {
                  const color = nextColor(state.color);
                  setState({ ...state, color: color });
                }}
              >
                <SquareTwoToneIcon className={`color-${state.color}`} />
              </div>
              <div className="entries-panel-dots">
                <Dropdown
                  className="entries-panel-dots-dropdown"
                  icon={<MoreVertIcon style={{ color: 'white' }} />}
                  items={entriesPanelDotsDropdown()}
                />
              </div>
            </div>
          </div>
          {data.map((item, index) => (
            <div
              key={index}
              className={`list-item-div ${`background-${item.color}` || ''}`}
            >
              <div className="entry-list-item-text">
                {!item.isEdit ?
                  <div>
                    <h6 className={`entry-list-item-h6 ${item.value ? '' : 'onlyKey'}`}>
                      {item.key}
                    </h6>
                    <span className="entry-list-item-span">
                      {state.showValue ? item.value : '*****'}
                    </span>
                  </div> :
                  <div>
                    <input
                      value={state.editKey}
                      onChange={(e) => setState({ ...state, editKey: e.target.value })}
                      id="keyEditInput"
                      className="entry-key-edit-input">
                    </input>
                    <input
                      value={state.editValue}
                      onChange={(e) => setState({ ...state, editValue: e.target.value })}
                      id="valueEditInput"
                      className="entry-value-edit-input">
                    </input>
                    <DoneOutlinedIcon
                      className="entry-edit-submit"
                      onClick={() => handleUpdateEntry(item.id, {
                        key: document.getElementById('keyEditInput').value || null,
                        value: document.getElementById('valueEditInput').value || null
                      })}
                    />
                    <CloseOutlinedIcon onClick={() => setEntryUpdate(item, false)} className="entry-edit-decline" />
                  </div>
                }
              </div>
              <div
                style={{ paddingBottom: 5 }}
                className="entry-action-buttons"
              >
                <div
                  className="entry-action-color-button"
                  onClick={() => {
                    handleUpdateEntryColor(item.id, { color: state.color });
                  }}
                >
                  <DoneOutlinedIcon className="entry-action-color-icon" />
                </div>
                <Dropdown
                  className={`entry-item-dropdown ${item.value ? 'key-value-entity' : 'only-key-entity'}`}
                  icon={<MoreVertIcon />}
                  items={entryDropdown(item)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default EntriesPage;
