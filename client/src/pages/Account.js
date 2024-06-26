import React, { useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react-lite';

import { Context } from '../index';
import { sendNotification, getByIdOrUsername } from '../http';
import { TextButton } from '../lib/Buttons';
import { Form, FormInput, FormInputExplanation, FormTitle } from '../lib/Forms';
import { notificationType } from '../constants.js';
import { popupNotification } from '../helpers.js';

import '../styles/Account.css';
import '../styles/Lists.css';

const AccountPage = observer(() => {
  const context = useContext(Context);
  const user = context.user.user;

  // Global state
  const [state, setState] = useState({
    friends: [],
    search: '',
  });

  const searchByUsername = async (username) => {
    if (username !== '') {
      const result = await getByIdOrUsername(username);
      if (!result.data) {
        return setState({ ...state, friends: [], search: '' });
      }

      setState({
        ...state,
        friends: [result.data],
        search: '',
      });
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const message = `${user.userData.username} want to become your friend!`;
      const data = {
        message: message,
        senderImageUrl: user.userData.downloadUrl,
      };
      const response = await sendNotification(
        user.id,
        friendId,
        notificationType.friendRequest,
        data,
      );
      if (response.error) {
        return popupNotification(response.error, 'warning');
      }
      popupNotification('Friend request was successfully sent!', 'success');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="account-container">
      <ToastContainer
        style={{ marginTop: 30 }}
        position="top-right"
        autoClose={5000}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="account-position-container">
        <h2>Accounts page</h2>
        <hr
          style={{
            color: 'black',
            backgroundColor: 'black',
            height: 1,
            width: '100%',
          }}
        />

        <div style={{ display: 'flex' }}>
          <Form style={{ marginTop: 6, width: '100%' }}>
            <FormTitle text="Search for friends" />
            <FormInput
              value={state.search}
              onChange={(e) => setState({ ...state, search: e.target.value })}
              onKeyDown={() => searchByUsername(state.search)}
            />
            <FormInputExplanation text="Search for friends to share your dictionaries with them later" />
          </Form>
          <TextButton
            style={{ marginTop: 25.5 }}
            onClick={() => searchByUsername(state.search)}
            text="Search"
          />
        </div>

        <div style={{ marginTop: 12, width: '100%' }}>
          {state.friends.length !== 0 ? (
            state.friends.map((item, index) => (
              <div
              key={index}
                onClick={() => sendFriendRequest(item.id)}
                className="list-item-div"
              >
                <div className="list-item-left">
                  <a key={item.id} className="list-item-a">
                    <div className="entry-list-item-text">
                      <h6 className="entry-list-item-h6">
                        {item && item.name}
                      </h6>
                      <span className="entry-list-item-span">
                        {item.username}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <FormInputExplanation text="Its nothing here" />
          )}
        </div>
      </div>
    </div>
  );
});

export default AccountPage;
