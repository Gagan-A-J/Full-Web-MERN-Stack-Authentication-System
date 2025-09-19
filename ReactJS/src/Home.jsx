import React from 'react';
import Logout from './Logout';

export default function Home({user, setUser}) {

  return (
    <>
      <h1>Welcome to Home of {user?.email || "User"}</h1>
      <Logout setUser={setUser}/>
    </>
  );
}