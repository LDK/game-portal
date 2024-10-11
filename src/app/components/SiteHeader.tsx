import Link from "next/link";
import { useState, useEffect } from "react";
import { getActiveUser, setUser, clearUser } from "../redux/user";
import Tabs from "./Tabs";
import { useAppSelector, useAppDispatch } from "../redux/store";
import useUser from "../hooks/useUser";

const SiteHeader = () => {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const { user, tokenExpired, setTokenExpired } = useUser();

  useEffect(() => {
    // console.log('User:', user);
  }, [user]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('Token expired:', tokenExpired);
    if (tokenExpired) {
      setLoginModalOpen(true);
      dispatch(clearUser());
      setTokenExpired(false);
    }
  }, [tokenExpired, dispatch, setTokenExpired]);


  const LoginModal = () => {
    if (!loginModalOpen) return null;

    function getToken(name:string) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    }

    const csrfToken = getToken('csrftoken');

    const overlayClick = (e:React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setLoginModalOpen(false);
      }
    }

    const handlePost = async (url:string, data:Record<string, string>) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || ''
        },
        body: JSON.stringify(data)
      });

      // console.log('Response:', response);

      if (response.status === 200) {
        setLoginModalOpen(false);
        return dispatch(setUser(await response.json()));
      }

      return response.json();
    };

    return (
      <div className="absolute border-white border-solid top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={overlayClick}>
        <div className="bg-gray-500 p-4 rounded-lg w-2/3 md:w-1/2 lg:w-2/5 text-black">
            <Tabs tabs={[
              { label: "Login", 
                content: (   
                <form className="flex flex-col" method="post" onSubmit={async (e) => { 
                  e.preventDefault();
                  console.log('Logging in user:', e.target);
                  handlePost('http://localhost:8000/user/login/', {
                  username: (e.target as any).username.value,
                  password: (e.target as any).password.value
                }); }}>
                  <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken || ""} />
                  <p>Enter your username and password to log in to your account.</p>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" autoComplete="username" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" autoComplete="current-password" />
                  </div>

                  <input type="submit" value="Login" />

                </form>)
              },
              { label: "Register", content: (
                <form className="flex flex-col" method="post" onSubmit={async (e) => { 
                  e.preventDefault();
                  
                  handlePost('http://localhost:8000/user/register/', {
                  username: (e.target as any).username.value,
                  password: (e.target as any).password.value,
                  email: (e.target as any).email.value
                }); }}>
                  <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken || ""} />
                  <p>Enter a username and password to create a new account.</p>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" autoComplete="username" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" autoComplete="email" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" autoComplete="new-password" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password2">Confirm Password</label>
                    <input type="password" id="password2" autoComplete="new-password" />
                  </div>

                  <input type="submit" value="Register" />
                </form>
              )}
            ]} />
        </div>
      </div>
    );
  };

  const LoginRegisterLink = () => (
    <div className="float-right mt-6">
      <span style={{ cursor: 'pointer' }} onClick={() => setLoginModalOpen(true)}>Log in/Register</span>
    </div>
  );

    // console.log('User:', user);
  const LogoutLink = () => (
    <>
      <div className="float-right mt-6">
        <span className="pr-4">Hiya, {user?.username}!</span>
        <span style={{ cursor: 'pointer' }} onClick={() => dispatch(clearUser())}>Log out</span>
      </div>
    </>
  );

  return (
    <div className="site-header">
      <h1 className="inline-block"><Link href="/">Rainy Days Game Portal</Link></h1>
      {!user && <LoginRegisterLink />}
      {user && <LogoutLink />}
      <LoginModal />
    </div>
  )
};

export default SiteHeader;