import React from 'react'
import NavBar from './NavBar'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from '../styles/Login.module.css'

export default function Login() {
    const navigate = useNavigate()

    const authFailed = () => {
        console.log('auth failed')
        navigate('/login')
        setError('Incorrect login, please try again..')
        setUsername('')
        setPassword('')
    }
    
    const login = async (e) => {
        const API = import.meta.env.VITE_API_URL
        e.preventDefault()
        console.log("login triggered")
        try { 
            const res = await fetch(`${API}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            const data = await res.json()
            console.log(data)
            if (data.auth) {
                navigate('/home')
            } else {
                authFailed()    
            }
        } catch (err) {
            authFailed()
        }
    }
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

  return (
    <div className={styles.mainContainer}>
        <NavBar></NavBar>
        <h1 className={`${styles.title} text`}>Welcome to the blog website</h1>
        {error ? <p className={`${styles.slogan} text`}>{ error }</p> : <p className={`${styles.slogan} text`}>Please login below:</p>}
        <form onSubmit={ login } className={styles.form}>
            <div className={styles.container}>
                <label htmlFor="username" className='text'>Enter your username:</label>
                <input className={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className={styles.container}>
                <label htmlFor="password" className='text'>Enter your password:</label>
                <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className={styles.btnContainer}>
                <button className={styles.button} type='submit'>Login!</button>
            </div>
        </form>  
    </div>
  )
}
