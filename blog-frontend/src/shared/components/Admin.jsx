import React from 'react'
import NavBar from './NavBar';
import { authUser, formatDate, sortPosts }from '/src/shared/functions/login.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import styles from '../styles/Admin.module.css'
import { adminAccess } from '../functions/login.js'

export default function Admin() {
    const API = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const [viewForm, setViewForm] = useState(false)
    const [user, setUser ] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [published, setPublished] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(()=> {
        const loadPage = async () => {
            const user = await authUser()
            setUser(user)
            const data = await adminAccess()
            const sortedData = sortPosts(data)
            setPosts(sortedData)
            setLoading(false)
            if (!user) {
                navigate('/login')
            }
        }
        loadPage()
    }, [viewForm])
    
    const submitPost = async (e) => {
        e.preventDefault()
        console.log('submission triggered')
        if (!user) {
            console.log("can't find user")
            navigate('/login')
        }
        if (title.length < 1) {
            console.log('err1')
            setMessage('Please add a title..')
            return console.log(message)
        }
        if (body.length < 1) {
            return setMessage('Please include a body..')
        }
        try {
            const res = await fetch(`${API}/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    body,
                    published
                })
            })
            const data = await res.json()
            console.log(data)
            setMessage(`You created a post titled "${title}"`)
            setViewForm(false)
            setTitle('')
            setBody('')
            setPublished(true)

        } catch(err) {
            console.log('submission failed')
        }
    }

    const changePublish = async (published, id) => {
        const res = await fetch(`${API}/update/${id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ published })
            })
        const data = await res.json()
        console.log(data.posts)
        const sortedData = sortPosts(data.posts)
        setPosts(sortedData)


    }
    

    return (
        <>
            <div>
                {!loading ? 
                <div className={styles.blogsContainer}>
                    <NavBar authUser={user}></NavBar>
                    <ul className={`${styles.list} text`}> 
                        <div className={`${styles.header}`}>
                            <div className={`${styles.button} ${!viewForm ? styles.active : ""}`} onClick={() => {
                                setViewForm(false)
                                setMessage('')
                            }}>Blogs</div>
                            <div className={`${styles.button} ${viewForm ? styles.active : ""}`} onClick={() => {
                                setViewForm(true)
                                setMessage('')
                            }}>Create new post</div>
                        </div>
                        { message.length > 0 ? <p className={styles.message}>{message}</p> : <></> }
                        { !viewForm ? posts.map((post) => {
                                return (
                                    <li key={post.id} className={`${styles.blog} text`}>
                                        <div>{post.title}</div>
                                        <div className={styles.date}>{`Created on: ${formatDate(post.createdAt)}`}</div>
                                        <div className={styles.toggleContainer}>
                                            {post.published ? 
                                                <div className={`${styles.toggle} ${styles.red}`} onClick={() => changePublish(false, post.id)}>Unpublish</div>
                                            :
                                            <div className={`${styles.toggle} ${styles.green}`} onClick={() => changePublish(true, post.id)}>Publish</div>
                                            }
                                        </div>
                                    </li>)})

                        : <form action="" method='POST' onSubmit={submitPost} className={styles.form}>
                                <label htmlFor="title">Post title:</label>
                                <input type="text" className={styles.inputText} value={title} onChange={(e) => setTitle(e.target.value)}/>
                                <label htmlFor="body">Post body:</label>
                                <textarea  className={styles.textArea} name="body" id="body" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                                <fieldset className={styles.formButtons}>
                                    <div>Publish?</div>
                                    <label htmlFor="publishTrue" className={styles.inputButton}>Yes
                                        <input type="radio" name='publish' id='publishTrue' 
                                        checked={published === true}
                                        onChange={() => setPublish(true)}/></label>
                                    <label htmlFor="publishFalse" className={styles.inputButton}>No
                                        <input type="radio" name='publish' id='publishFalse' 
                                        checked={published === false}
                                        onChange={() => setPublished(false)}/></label>
                                </fieldset>
                                <button className={styles.submitButton}>Create post!</button>

                            </form> 
                        }
                    </ul>
                </div> : <span className='text'>still loading...</span>}
            </div>
        </>
    )
}

/*
*/