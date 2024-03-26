import axios from 'axios';
import jwt_decode from 'jwt-decode';
import * as config from '../config.js';

const host = axios.create({ baseURL: config.baseURL, timeout: config.timeout });
const authHost = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
});

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
};
authHost.interceptors.request.use(authInterceptor);

const catchError =
  (apiFunction) =>
  async (...params) => {
    try {
      return await apiFunction(...params);
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  };

export const createOrUpdateDictionary = async (data) => {
  const userId = data.userId;

  const body = {};
  if (data.dictionaryId) body.dictionaryId = data.dictionaryId;
  if (data.name) body.name = data.name;
  if (data.icon) body.icon = data.icon;

  return await authHost.post(`/users/${userId}/dictionaries/`, body);
};

export const updateDictionary = async (data) => {
  if (!data.dictionaryId || !data.userId) {
    return;
  }

  const body = {};
  if (data.name) body.name = data.name;
  if (data.icon) body.icon = data.icon;

  return await authHost.post(
    `/users/${data.userId}/dictionaries/${data.dictionaryId}/`,
    body,
  );
};

export const getDictionaries = async (userId) => {
  const res = await authHost.get(`/users/${userId}/dictionaries/`);
  return res.data;
};

export const getDictionary = async (userId, dictionaryId) => {
  const res = await authHost.get(
    `/users/${userId}/dictionaries/${dictionaryId}/`,
  );
  return res.data;
};

export const deleteDictionary = async (userId, dictionaryId) => {
  return await authHost.delete(
    `/users/${userId}/dictionaries/${dictionaryId}/`,
  );
};

export const shareDictionary = async (userId, dictionaryId, recipientId) => {
  return await authHost.post(`/users/${userId}/share-dictionary/`, {
    dictionaryId,
    recipientId,
  });
};

export const createEntry = async (data) => {
  const { userId, dictionaryId, key, value } = data;
  return await authHost.post(
    `/users/${userId}/dictionaries/${dictionaryId}/entries/`,
    { key, value },
  );
};

export const updateEntry = async (userId, dictionaryId, entryId, data) => {
  const response = await authHost.post(
    `/users/${userId}/dictionaries/${dictionaryId}/entries/${entryId}/`,
    data,
  );
  return response.data;
};

export const getEntries = async (userId, dictionaryId) => {
  return await authHost.get(
    `/users/${userId}/dictionaries/${dictionaryId}/entries/`,
  );
};

export const deleteEntry = async (userId, dictionaryId, entryId) => {
  return await authHost.delete(
    `/users/${userId}/dictionaries/${dictionaryId}/entries/${entryId}/`,
  );
};

export const registration = catchError(async (email, password) => {
  const response = await host.post('/users/', { email, password });
  localStorage.setItem('token', response.data.token);
  return { ...jwt_decode(response.data.token), userData: response.data.user };
});

export const login = catchError(async (email, password) => {
  const response = await host.post('/login/', { email, password });
  localStorage.setItem('token', response.data.token);
  return { ...jwt_decode(response.data.token), userData: response.data.user };
});

export const check = async () => {
  const response = await authHost.get(`/check/`);
  localStorage.setItem('token', response.data.token);
  return { ...jwt_decode(response.data.token), userData: response.data.user };
};

export const updateProfile = async (userId, fields) => {
  return await authHost.post(`/users/${userId}/update-profile/`, { fields });
};

export const addToFriendsByUsername = async (userId, friendId) => {
  return await authHost.post(`/users/${userId}/friends/`, {
    friendId: friendId,
  });
};

export const getFriends = async (userId) => {
  return await authHost.get(`/users/${userId}/friends/`);
};

export const updateUsername = async (userId, username) => {
  return await authHost.post(`/users/${userId}/username/`, {
    username: username,
  });
};

export const getByIdOrUsername = async (data) => {
  return await authHost.get(`/users/${data}`);
};

// TODO refactor like in endpoints higher
export const subscribeNotifications = async () => {
  const eventSource = new EventSource(`${config.baseURL}/notifications/`);
  eventSource.onmessage = function (event) {
    return JSON.parse(event.data);
  };
};

export const sendNotification = catchError(
  async (senderId, recipientId, type, data) => {
    return await authHost.post('/notifications/', {
      senderId,
      recipientId,
      type,
      data,
    });
  },
);

// TODO: depricated
export const sendProfileImage = async (userId, formData) => {
  return await authHost.post(
    `/users/${userId}/upload-profile-image/`,
    formData,
  );
};

export const updateProfileImage = catchError(async (userId, formData) => {
  const response = await authHost.post(`/users/${userId}/files/`, formData);
  return response.data;
});

export const getProfileImageUrl = catchError(async (userId, fileId) => {
  const response = await authHost.get(`/users/${userId}/files/${fileId}`);
  return response.data;
});

export const importDictionary = async (userId, formData) => {
  return await authHost.post(`/users/${userId}/import-dictionary/`, formData);
};

export const getNotificationsByUserId = async (userId) => {
  const response = await authHost.get(`/users/${userId}/notifications/`);
  return response.data;
};

export const deleteNotification = async (userId, notificationId) => {
  return await authHost.delete(
    `/users/${userId}/notifications/${notificationId}/`,
  );
};
