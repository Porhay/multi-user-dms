import React, { useState } from 'react';

import avatarDefault from '../assets/images/profile-image-default.jpg';
import '../styles/Dropdown.css';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// TODO fix onClickOutside: if mouse enter and leave without click, it will not be opened on next enter
const Dropdown = (props) => {
  const [open, setOpen] = useState(false);

  const onClickOutsideListener = () => {
    setOpen(false);
    document.removeEventListener('click', onClickOutsideListener);
  };

  const onMouseLeaveListener = () => {
    return () => document.addEventListener('click', onClickOutsideListener);
  };

  if (!props.option || props.option === 'default') {
    return (
      <>
        <a
          onMouseLeave={onMouseLeaveListener()}
          className="icon-button"
          onClick={() => setOpen(!open)}
        >
          {props.icon}
        </a>
        {open && (
          <div
            onMouseLeave={onMouseLeaveListener()}
            className={props.className}
          >
            {props.items.length !== 0 ? (
              props.items.map((item) => {
                return (
                  <a
                    key={item.message}
                    className="menu-item"
                    onClick={item.action}
                  >
                    {item.message}
                  </a>
                );
              })
            ) : (
              <div className="nav-items-empty-div">
                &nbsp;&nbsp;It's empty for now&nbsp;&nbsp;
              </div>
            )}
          </div>
        )}
      </>
    );
  } else if (props.option === 'notification') {
    return (
      <>
        <a className="icon-button" onClick={() => setOpen(!open)}>
          {props.icon}
        </a>
        {open && (
          <div className={props.className}>
            {props.items.length !== 0 ? (
              props.items.map((item) => {
                return (
                  <div key={item.id} className="dropdown-notification-div">
                    <div className="dropdown-notification-sender-image-div">
                      <img
                        src={item.data.senderImageUrl || avatarDefault}
                        className="dropdown-notification-sender-image"
                        alt="sender image"
                      />
                    </div>
                    <a className="notification-menu-item">
                      {item.data.message}
                    </a>
                    <div
                      style={{ color: 'white', fontSize: 26, marginRight: 10 }}
                    >
                      <a
                        onClick={item.action}
                        style={{
                          marginRight: 10,
                          color: 'green',
                          cursor: 'pointer',
                        }}
                      >
                        <span>✓</span>
                      </a>
                      <a
                        onClick={item.cancel}
                        style={{ cursor: 'pointer', color: 'red' }}
                      >
                        <span>×</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="nav-items-empty-div">
                &nbsp;&nbsp;It's empty for now&nbsp;&nbsp;
              </div>
            )}
          </div>
        )}
      </>
    );
  }
};

export { Dropdown };
