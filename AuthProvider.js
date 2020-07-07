import React, {useState, useContext} from 'react';
import Realm, { Auth } from 'realm';
import {RealmApp} from './config.realm';

const app = RealmApp();

const AuthContext = React.createContext(null);

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const logIn = async (email,password) => {
    console.log(`Logging In As ${email}`);

    const creds = Realm.Credentials.emailPassword(email,password);

    const newUser = await app.logIn(creds)

    setUser(newUser)

    console.log(`Logged In As ${newUser.identity}`)
  }

  const logOut = () => {
    if(user === null) {
      console.warn('No User To Log Out');
      return;
    }

    console.log('Logging Out');

    user.logOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider 
      value={{
          logIn,
          logOut,
          user
    }}>
    {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const auth = useContext(AuthContext)
  if (auth == null) {
    throw new Error('useAuth() called outside of a AuthProvider');
  }

  return auth;
}

export {AuthProvider, useAuth}