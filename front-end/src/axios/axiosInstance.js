import axios from 'axios';
const ipAddress = process.env.REACT_APP_IP_ADDRESS;

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: `http://${ipAddress}:8080/`,
});

instance.defaults.withCredentials = true;

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// Add a request interceptor
instance.interceptors.request.use(
  // Do something before request is sent
  async (config) => {   
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
