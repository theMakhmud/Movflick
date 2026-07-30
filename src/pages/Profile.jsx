import React, { useEffect } from 'react'
import { account } from '../lib/appwrite'

const Profile = () => {

  useEffect(() => {
    account.get()
      .then(user => console.log('Залогинен:', user))
      .catch(err => console.log('Не залогинен (это нормально):', err.message))
  }, [])
}

export default Profile