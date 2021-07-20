import axios from 'axios'

const fetch = ({ url, params, method = 'GET', data, headers }) => {
  let options = {
    url,
    method,
    params,
    data,
    timeout: 10000,
    headers,
  }
  if (method === 'GET') {
    options.params = {
      ...options.params,
      t: new Date().getTime()
    }
  }
  return axios(options)
    .then(res => {
      return res.data
      // if (res.data.code !== 200) {
      //   console.warn(res.data)
      // } else {
      //   return res.data
      // }
    })
    .catch(err => {
      console.warn(err)
    })
}

export default fetch

