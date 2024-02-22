
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
