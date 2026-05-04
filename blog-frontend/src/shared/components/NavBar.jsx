import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/NavBar.module.css'
import { useNavigate } from 'react-router'

export default function NavBar({authUser}) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const res = await fetch("http://localhost:3000/logout", {
            method: "GET",
            credentials: "include",
        });
        console.log(res.status)
        navigate('/login')
    };
    return (
        <>
            { authUser ? 
            <div className={styles.container}>
                <ul className={styles.list}>
                    <li>
                        <Link to='/home' className={`${styles.link} text`}>Home</Link>
                    </li>
                    <li>
                        <Link to='/admin' className={`${styles.link} text`}>Admin Access</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className={`${styles.link} text`}>Logout</button>
                    </li>
                </ul> 
            </div> : 
            <div className={styles.container}>
                <ul className={styles.list}>
                    <li>
                        <Link to='/' className={`${styles.link} text`}>Register</Link>
                    </li>
                    <li>
                        <Link to='/login' className={`${styles.link} text`}>Login</Link>
                    </li>
                </ul>
            </div> }
        </>
    )
}




