import { useEffect, useState } from "react";
import { UserToken, clearUser, getActiveUser, setUser } from "@/app/redux/user";
import { setAxiosTokenCallback, setAxiosRefreshExpiredCallback, updateAxiosToken } from "../axiosWithIntercept";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";

const useUser = () => {
  const user = useAppSelector(getActiveUser);
  const dispatch = useAppDispatch();
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    if (user) {
      setAxiosTokenCallback((token:UserToken) => 
        dispatch(setUser({ ...user, token }))
      );
    }
    
    setAxiosRefreshExpiredCallback(() => {
      console.log('Token expired');
      setTokenExpired(true);
    });

    updateAxiosToken(user?.token || null);
    console.log('User token updated:', user?.token);

  }, [user?.token, dispatch]);

  useEffect(() => {
    if (tokenExpired) {
      dispatch(clearUser());
      setTokenExpired(false);
    }
  }, [tokenExpired]);

  const handleLogout = () => {
    dispatch(clearUser());
    setTokenExpired(false);
  }

  return { user, handleLogout, tokenExpired, setTokenExpired };
}

export default useUser;