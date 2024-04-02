import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { genRandomDigit, getNextIcon } from '../helpers';
import { ROUTES, dictionaryIcons } from '../constants';
import { Context } from '../index';

import Friends from '../modals/Friends';
import { Dropdown } from '../components/Dropdown';
import { Form, FormInput, FormInputExplanation, FormTitle } from '../lib/Forms';
import { TextButton } from '../lib/Buttons';
import { Icon } from '../lib/Icons';

import {
  createOrUpdateDictionary,
  updateDictionary,
  getDictionaries,
  deleteDictionary,
  importDictionary,
  getEntries,
} from '../http';

import '../styles/Dictionaries.css';
import '../styles/Lists.css';

const DictionariesPage = observer(() => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const user = context.user.user;

  // Global state
  const [state, setState] = useState({
    nameOfNew: '',
    nameToEdit: '',
    showModal: false,
    currentItem: null,
  });

  // All dictionaries data
  const [data, setData] = useState([]);

  const dropdownListFunc = (item) => [
    { message: 'Edit', action: () => setEdit(item.id) },
    {
      message: 'Share',
      action: () => setState({ ...state, showModal: true, currentItem: item }),
    },
    {
      message: 'Export',
      action: () => handleExportDictionary(user.id, item.id, item.name),
    },
    { message: 'Delete', action: () => handleDeleteDictionary(item.id) },
  ];

  useEffect(() => {
    const _fetchData = async () => {
      const data = await getDictionaries(user.id);
      const dictionaries = data.sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );

      // add edit, icon rows for every
      for (const entity of dictionaries) {
        entity.edit = false;
        entity.icon = entity.icon ? entity.icon : dictionaryIcons[genRandomDigit(dictionaryIcons.length)];
      }
      setData(dictionaries);
    };
    _fetchData();
  }, []);

  const newDictionary = async () => {
    const newDictionary = await createOrUpdateDictionary({
      userId: user.id,
      name: state.nameOfNew,
    });
    setData((prevState) => [newDictionary.data, ...prevState]);
    setState({ ...state, nameOfNew: '' });
  };
  const openDictionary = async (dictionaryId) => {
    navigate(ROUTES.ENTRIES + '/' + dictionaryId);
  };
  const handleDeleteDictionary = async (dictionaryId) => {
    await deleteDictionary(user.id, dictionaryId).catch((e) => console.log(e));
    setData([...data.filter((item) => item.id !== dictionaryId)]);
  };
  const handleUpdateDictionary = async (dictionaryId, name) => {
    await updateDictionary({
      userId: user.id,
      dictionaryId,
      name: name,
    });

    for (const entity of data) {
      if (entity.id === dictionaryId) {
        entity.name = name;
      }
    }

    // close
    setEdit(dictionaryId, false);
    setState({ ...state, nameToEdit: '' });
  };
  const setEdit = (currentId, toOpen = true) => {
    let withEditTrueForCurrent = [];
    for (const entity of data) {
      if (entity.id === currentId) {
        if (toOpen) {
          setState({ ...state, nameToEdit: entity.name });
          entity.edit = true;
        } else {
          entity.edit = false;
        }
      }
      withEditTrueForCurrent.push(entity);
    }
    setData(withEditTrueForCurrent);
  };
  const importNewDictionary = async (userId, formData) => {
    await importDictionary(userId, formData);
    // update state
  };
  const handleExportDictionary = async (
    userId,
    dictionaryId,
    dictionaryName,
  ) => {
    const response = await getEntries(userId, dictionaryId);
    const data = response.data.reverse();

    // set default structure
    const txtContent = data
      .map((entry) => `${entry.key}\t${entry.value}`)
      .join('\n');

    // download as txt
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${dictionaryName}.txt`;
    link.href = url;
    link.click();
  };
  const updateDictIcon = (() => {
    let timer; // To store the timer reference

    return (item) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const nextIcon = getNextIcon(item.icon);
        data.find((dictData) => dictData.id === item.id).icon = nextIcon;
        setData([...data]);
        await updateDictionary({
          userId: user.id,
          dictionaryId: item.id,
          icon: nextIcon,
        });
      }, 500);
    };
  })();

  return (
    <div className="dictionary-container">
      <div className="dictionary-position-container">
        <div style={{ display: 'flex' }}>
          <Form style={{ marginTop: 6, width: '100%' }}>
            <FormTitle text="Name your future masterpiece" />
            <FormInput
              variant="space-left"
              value={state.nameOfNew}
              onChange={(e) =>
                setState({ ...state, nameOfNew: e.target.value })
              }
              onKeyDown={newDictionary}
            >
              <label htmlFor="select-file">
                <span
                  style={{ marginLeft: 10, marginTop: 0, cursor: 'pointer' }}
                  data-tootik-conf="left"
                  data-tootik="Tap to import dictionary"
                >
                  &#x1f914;
                </span>
                <input
                  type="file"
                  accept=".txt"
                  id="select-file"
                  style={{ display: 'none' }}
                  onChange={async (event) => {
                    const formData = new FormData();
                    formData.append('text-file', event.target.files[0]);
                    await importNewDictionary(user.id, formData);
                  }}
                />
              </label>
            </FormInput>
            <div className="dictionary-sort-block">
              <FormInputExplanation text="That name can be edited in future, you can always delete your dictionary" />
              <div className="dictionary-sort-button-div">
                <a
                  onClick={() => {
                    const sortedData = data.sort((a, b) =>
                      a.name < b.name ? -1 : 1,
                    );
                    setData([...sortedData]);
                  }}
                >
                  <span className="dictionary-sort-button-span">
                    → Sort by name
                  </span>
                </a>
              </div>
            </div>
          </Form>
          <TextButton
            style={{ marginTop: 25 }}
            onClick={newDictionary}
            text="New"
          />
        </div>

        <div className="dictionary-list-div">
          {data.map((item) => (
            <>
              <div className="list-item-div">
                <div className="list-edit-form-general-div">
                  {item.edit ? (
                    <div key={item.id} className="list-edit-form-div">
                      <div onClick={() => updateDictIcon(item)}>
                        <Icon
                          icon={item.icon}
                          style={{ marginRight: 6, marginBottom: 3 }}
                        />
                      </div>

                      <Form>
                        <FormInput
                          style={{ marginLeft: 10 }}
                          value={state.nameToEdit}
                          onChange={(e) =>
                            setState({ ...state, nameToEdit: e.target.value })
                          }
                        />
                      </Form>
                      <TextButton
                        onClick={() =>
                          handleUpdateDictionary(item.id, state.nameToEdit)
                        }
                        text="Update"
                      />
                      <TextButton
                        variant="cancel"
                        onClick={() => setEdit(item.id, false)}
                        text="Cancel"
                      />
                    </div>
                  ) : (
                    <div className="list-edit-form-div">
                      <div onClick={() => updateDictIcon(item)}>
                        <Icon
                          icon={item.icon}
                          style={{ marginRight: 6, marginBottom: 3 }}
                        />
                      </div>
                      <a key={item.id} className="list-item-a">
                        <span onClick={() => openDictionary(item.id)}>
                          {item.name}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
                <div className="dictionaries-right">
                  <span className="list-counter">{item.count} items</span>
                  <Dropdown
                    className="item-dropdown"
                    icon="Options"
                    items={dropdownListFunc(item)}
                  />
                </div>
              </div>

              <Friends
                item={state.currentItem}
                show={state.showModal}
                onHide={() => setState({ ...state, showModal: false })}
              />
            </>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DictionariesPage;
