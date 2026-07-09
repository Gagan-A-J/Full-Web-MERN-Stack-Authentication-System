import React from 'react';
import Logout from './Logout';

export default function Home({user, setUser}) {

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 mt-4">Welcome to Home of {user?.username || "User"}</h1>
      <Logout setUser={setUser}/>
    </>
  );
}