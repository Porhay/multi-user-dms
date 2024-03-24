import { toast } from "react-toastify"

export const readURL = file => {
    return new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = e => res(e.target.result)
        reader.onerror = e => rej(e)
        reader.readAsDataURL(file)
    })
}

export const generateRandomDigit = () => {
    return Math.floor(Math.random() * 9 * Math.pow(10, 1 - 1)) + Math.pow(10, 1 - 1)
}

export const popupNotification = (text, type = 'success') => {
    switch (type) {
        case 'success':
            toast.success(text, {
                position: "top-right", autoClose: 1500,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true
            })
            break;
        case 'warning':
            toast.warning(text, {
                position: "top-right", autoClose: 1500,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true
            })
            break;

        default:
            toast.success(text, {
                position: "top-right", autoClose: 1500,
                hideProgressBar: false, closeOnClick: true,
                pauseOnHover: true, draggable: true
            })
            break;
    }
}

export const nextColor = (currentColor) => {
    const colors = ['green', 'purple', 'yellow', 'red']
    const index = colors.indexOf(currentColor)
    const res = colors[index + 1] || colors[0]
    return res
}
