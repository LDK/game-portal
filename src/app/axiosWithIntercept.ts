// axiosWithIntercept.ts
import axios from "axios";
import { UserToken } from "@/app/redux/user";

const axiosWithIntercept = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

let userToken: (UserToken | null) = null;
let tokenCallback: ((token: UserToken) => void) | null = null;
let expiredCallback: (() => void) | null = null;
let refreshCallback: (() => void) | null = null;

export const updateAxiosToken = (token: (UserToken | null)) => {
  userToken = token;
  
  if (!token) {
    delete axiosWithIntercept.defaults.headers.common['Authorization'];
    return;
  }

  const auth = `Bearer ${token.access}`;
  console.log('Setting axios token:', auth);

  axiosWithIntercept.defaults.headers.common['Authorization'] = auth;
}

export const setAxiosTokenCallback = (callback: (token: UserToken) => void) => {
  tokenCallback = callback;
}

export const setAxiosRefreshExpiredCallback = (callback: () => void) => {
  expiredCallback = callback;
}

export const setAxiosRefreshCallback = (callback: () => void) => {
  refreshCallback = callback;
}

let isRefreshingToken = false;

axiosWithIntercept.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && error.response.data.code === 'token_not_valid' && !isRefreshingToken) {
      isRefreshingToken = true;

      console.log('token_not_valid');

      try {
        if (!userToken) { 
          console.log('no token');
          expiredCallback?.();
          isRefreshingToken = false;
          return Promise.reject(error);
        }

        console.log('refresh token', userToken.refresh);

        const res = await axiosWithIntercept.post(`http://localhost:8000/token/refresh/`, { refresh: userToken.refresh });

        if (res.status === 200) {
          console.log('token refreshed', res.data.access);
          updateAxiosToken({ refresh: userToken.refresh, access: res.data.access } as UserToken);
          tokenCallback?.({ refresh: userToken.refresh, access: res.data.access } as UserToken);
          refreshCallback?.();

          axiosWithIntercept.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access;
          originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access;
          isRefreshingToken = false;
          return axiosWithIntercept(originalRequest);
        } else {
          console.log('failed res', res);
        }
      } catch (refreshError) {
        console.log('refresh error', refreshError, expiredCallback);
        expiredCallback?.();
        isRefreshingToken = false;
        return Promise.reject(refreshError);
      }
    }

    isRefreshingToken = false;
    return Promise.reject(error);
  }
);

export default axiosWithIntercept;
