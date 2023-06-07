import axios from 'axios'

const api = axios.create({
    baseURL: 'https://secretdbase.herokuapp.com'
})

// const api = axios.create({
//     baseURL: 'http://192.168.0.10:3333/'
// })

export default api