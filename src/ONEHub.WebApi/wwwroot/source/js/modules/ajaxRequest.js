import axios from 'axios';
import { resolveClientUrl } from './utils';

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

axios.interceptors.response.use(response => Promise.resolve(response),
    error => {
        const { response } = error;
        if (response) {
            const { data } = response;
            const status = data && data.ErrCode || response.status;

            switch (status) {
                case 401:
                    alert(response.Message || "Your session has expired! Please login again.");
                    // Cookies are HttpOnly, browser will handle them
                    window.location.href = '/portal/login';
                    break;
                case 403:
                    alert("You are not authorized to access this function.");
                    break;
                case 500:
                    alert("An error occurred while processing your request");
                    break;
                default:
                    break;
            }
        }

        return Promise.reject(error);
    });

const getHeaders = () => {
    return {
        'Content-Type': 'application/json'
        // No Authorization header needed - JWT is in HttpOnly cookie
    };
};

export const post = (relativeUrl, params, options) => {
    const url = resolveClientUrl(relativeUrl);

    return axios.post(url, params, {
        headers: getHeaders(),
        withCredentials: true  // Send cookies with request
    })
        .then(response => response)
        .catch(err => {
            options && options.onError && options.onError(err);
        });
}

export const get = (relativeUrl, options) => {
    const url = resolveClientUrl(relativeUrl);
    return axios.get(url, {
        headers: getHeaders(),
        withCredentials: true  // Send cookies with request
    })
}

export const postWithoutAlert = async (url, data) => {
    const originalAlert = window.alert;
    window.alert = () => { }; // Temporarily disable alerts

    try {
        const result = await post(url, data);
        return result;
    } finally {
        window.alert = originalAlert; // Restore original alert
    }
};
