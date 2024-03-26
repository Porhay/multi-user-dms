import { toast } from 'react-toastify';
import { entryColors, dictionaryIcons } from './constants';

export const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};

export const genRandomDigit = (maxIndex = 15) => {
  return (
    Math.floor(Math.random() * maxIndex * Math.pow(10, 1 - 1)) +
    Math.pow(10, 1 - 1)
  );
};

export const popupNotification = (text, type = 'success') => {
  switch (type) {
    case 'success':
      toast.success(text, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
    case 'warning':
      toast.warning(text, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;

    default:
      toast.success(text, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
  }
};

export const nextColor = (currentColor) => {
  const index = entryColors.indexOf(currentColor);
  const res = entryColors[index + 1] || entryColors[0];
  return res;
};

export const getNextIcon = (currentIcon) => {
  const index = dictionaryIcons.indexOf(currentIcon);
  const res = dictionaryIcons[index + 1] || dictionaryIcons[0];
  return res;
};
