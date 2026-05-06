import React from 'react'
import NavBar from 'src/shared/components/NavBar.jsx'
import styles from '../styles/Register.module.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL

  const authMessage = (message) => {
    console.log(message)
    navigate('/')
    setError(message)
  }

  const passwordFailed = () => {
    console.log('Passwords do not match..')
    navigate('/')
    setError('Passwords do not match..')
    setPassword('')
  }
  

  const register = async (e) => {
    e.preventDefault()
    console.log('registration triggered')
    if (username === '') {
      authMessage('Please enter a username..')
      return
    }
    if (password !== confirm) {
      passwordFailed()
      return
    }
    if (password === '') {
        authMessage('Please enter a password..')
        return
      } 
    try {
      const res = await fetch(`${API}/register`, {
        method:"POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      if (!res) {
        authMessage('This user already exists..')
        setPassword('')
        setConfirm('')
      }
      authMessage("You've successfully created an account!")
      setUsername('')
      setPassword('')
      setConfirm('')

      console.log('registration successful')
    } catch (err) {
        authMessage('Failed to register the account..')
    }

  }
  return (
    <div className={styles.mainContainer}>
        <NavBar></NavBar>
      <h1 className={`${styles.title} text`}>Welcome to the blog website</h1>
      { error ? <p className={`${styles.slogan} text`}>{error}</p> : 
        <p className={`${styles.slogan} text`}>Please register below, else navigate to the log in page above:</p>}
      <form  method='POST' className={`${styles.form} text`} onSubmit={register}>
        <div className={styles.container}>
          <label htmlFor="username" className='text'>Choose a username:</label>
          <input className={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className={styles.container}>
          <label htmlFor="password" className='text'>Choose a secure password:</label>
          <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={styles.container}>
          <label htmlFor="confirm" className='text'>Re-enter your password:</label>
          <input className={styles.input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className={styles.btnContainer}>
          <button type='submit' className={styles.button}>Register</button>
        </div> 
      </form>
    </div>
  )
}
