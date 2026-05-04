import React from 'react'
import NavBar from './NavBar';
import { fetchPosts, authUser, formatDate, sortPosts }from '/src/shared/functions/login.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { Link }from 'react-router-dom'
import styles from '../styles/Home.module.css'


export default function Home() {
    const navigate = useNavigate()
    const [viewUnpublished, setviewUnpublished] = useState(false);
    const [user, setUser ] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const loadPage = async () => {
            const user = await authUser()
            setUser(user)
            const data = await fetchPosts()
            console.log(data)
            setPosts(data)
            setLoading(false)
            if (!user) {
                navigate('/login')
            }
        }
        loadPage()
    }, [])
    
    const setBlogView = (boolean) => {
        setviewUnpublished(!boolean)
    }
    
    

    return (
        <>
            <div>
                {!loading ? 
                <div className={styles.blogsContainer}>
                    <NavBar authUser={user}></NavBar>
                    <ul className={`${styles.list} text`}> 
                        <div className={`${styles.header}`}>
                            {viewUnpublished ? 
                            <>
                                <h3 className={`text white`}>Blogs</h3>
                                <p className={`${styles.toggle}`} 
                                onClick={() => {
                                setBlogView(viewUnpublished)}}>
                                    Only view published blogs</p>
                            </>
                             :
                            <>
                                <h3 className={`text white`}>Blogs (published)</h3>
                                <p className={`${styles.toggle}`} 
                                onClick={() => {
                                setBlogView(viewUnpublished)}}>
                                    View all blogs</p>
                            </>
                            }
                        </div>
                        
                        { viewUnpublished ? posts.map((post) => {
                            console.log(post)
                            return (
                                <li key={post.id} className={`${styles.blog} text`}>
                                    <Link to={`/view/${post.id}`} state={{id: post.id}} className={styles.link}>
                                        <h3 className={`${styles.title} text`}>{post.title}</h3>
                                        <p className={`${styles.body} text`}>{post.body}</p>
                                        <div className={styles.footer}>
                                            <p>By: {post.username}</p>
                                            <p>On:  {formatDate(post.createdAt)}</p>
                                        </div>
                                    </Link>
                                </li>
                            )
                        }) : 
                        posts.filter(post => post.published)
                        .map((post) => {
                            return (
                                <li key={post.id} className={`${styles.blog} text`}>
                                    <Link to={`/view/${post.id}`} state={{id: post.id}} className={styles.link}>
                                        <h3 className={`${styles.title} text`}>{post.title}</h3>
                                        <p className={`${styles.body} text`}>{post.body}</p>
                                        <div className={styles.footer}>
                                            <p>By: {post.username}</p>
                                            <p>On:  {formatDate(post.createdAt)}</p>
                                        </div>
                                    </Link>
                                </li>
                                
                            )
                        })
                        }
                    </ul>
                </div> : <span className='text'>still loading...</span>}
            </div>
        </>
    )
}

/*
*/