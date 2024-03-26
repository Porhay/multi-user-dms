import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CommentIcon from '@mui/icons-material/Comment';

import {
  shareDictionary,
  getProfileImageUrl,
  getNotificationsByUserId,
  deleteNotification,
  addToFriendsByUsername,
} from '../http';
import { baseURL } from '../config.js';

import { Context } from '../index';
import { ROUTES } from '../constants';
import { Dropdown } from './Dropdown';

import avatarDefault from '../assets/images/profile-image-default.jpg';
import '../styles/Navigation.css';

const Navigation = observer(() => {
  const navigate = useNavigate();
  const context = useContext(Context);
  const user = context.user.user;

  // LOCAL STATE
  const [notifications, setNotifications] = useState([]);

  // UPDATE ON MOUNT
  useEffect(async () => {
    // get notifications live
    subscribe().catch((e) => console.log(e)); // TODO if no connection to the server subscribe func occurs error every 2 sec

    // set user avatar
    if (user.userData.image) {
      getProfileImageUrl(user.id, user.userData.image).then((response) => {
        context.user.updateUserData({ downloadUrl: response.downloadUrl });
      });
    }

    // get notifications from db
    getNotificationsByUserId(user.id).then((dbNotifications) => {
      for (const notification of dbNotifications) {
        setNotificationInDropdown(notification);
      }
    });
  }, []);

  // HELPERS
  const setNotificationInDropdown = (data) => {
    // TODO: add type
    const _removeNotification = async (context) => {
      setNotifications([
        ...notifications.filter((item) => item.id !== context.id),
      ]);
      await deleteNotification(user.id, context.id);
    };

    // Actions
    const storeReceivedDictionary = async (context) => {
      await shareDictionary(
        user.id,
        context.data.dictionaryId,
        context.recipientId,
      );
      await _removeNotification(context);
    };
    const addFriend = async (context) => {
      await addToFriendsByUsername(user.id, data.senderId);
      await _removeNotification(context);
    };

    let action;
    if (data.data.dictionaryId) {
      action = async () => await storeReceivedDictionary(data);
    } else {
      action = async () => await addFriend(data);
    }

    const cancel = async () => await _removeNotification(data);
    if (data.recipientId === user.id) {
      // TODO: move it to server side
      const newPost = { ...data, action, cancel };
      setNotifications((prev) => [newPost, ...prev]); // TODO fix dropdown shutdown on setState.
    }
  };
  const subscribe = async () => {
    const eventSource = new EventSource(`${baseURL}/notifications/`);
    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data); // {id, senderId, recipientId, data: {dictionaryId, message, senderImageUrl}}
      setNotificationInDropdown(data);
    };
  };

  const logOut = () => {
    context.user.setUser({});
    context.user.setIsAuth(false);
    navigate(ROUTES.LOGIN);
    localStorage.clear();
  };

  // DATA SETS
  const accountList = [
    { message: 'Accounts', action: () => navigate(ROUTES.ACCOUNT) },
    { message: 'Dictionaries', action: () => navigate(ROUTES.DICTIONARIES) },
    { message: 'Settings', action: () => navigate(ROUTES.SETTINGS) },
    { message: 'Log out', action: () => logOut() },
  ];

  // COMPONENTS
  const Navbar = (props) => (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
  const ProfileImage = () => (
    <img
      src={
        user.userData.downloadUrl ? user.userData.downloadUrl : avatarDefault
      }
      className="navigation-profile-image"
      alt="profile image"
    />
  );

  return (
    <Navbar>
      <a
        href="/"
        className="a-logo"
        onClick={() => navigate(ROUTES.DICTIONARIES)}
      >
        {/*<AccessibleForwardIcon/>DMS*/}
        <CommentIcon fontSize="small" /> DMS
      </a>
      <div className="nav-items-right">
        {context.user.isAuth ? (
          <div className="nav-one-item-right">
            <li key={notifications.message} className="nav-item">
              <Dropdown
                items={notifications}
                icon={<NotificationsNoneIcon className="icon" />}
                className="nav-notification-dropdown"
                option="notification"
              />
            </li>
            <li key={notifications.message} className="nav-item">
              <Dropdown
                items={accountList}
                icon={<ProfileImage />}
                className="nav-image-dropdown"
              />
            </li>
          </div>
        ) : (
          <div>
            <a className="menu-item" onClick={() => navigate(ROUTES.LOGIN)}>
              Authorisation
            </a>
          </div>
        )}
      </div>
    </Navbar>
  );
});

export default Navigation;
