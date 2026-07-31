import React, { useEffect } from 'react'
import { account } from '../lib/appwrite'
import { useAuth } from '../AuthContext'

const Profile = () => {
  const {logout} = useAuth()

  return (
    <button
    onClick={() => logout()}
    className='button'>
      <p>logout</p>
    </button>
  )
}

export default Profile