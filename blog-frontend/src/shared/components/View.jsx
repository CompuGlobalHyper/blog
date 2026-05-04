import React from 'react'
import { useEffect, useState } from 'react'
import NavBar from './NavBar'
import Post from '/src/features/posts/components/Post'
import { useLocation } from 'react-router-dom'
import { fetchUniquePost, authUser} from '../functions/login'


export default function UniquePost() {
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [user, setUser] = useState(null)
    const location = useLocation()
    const { id } = location.state || null

    useEffect(() => {
        const callback = async () => {
            const user = await authUser()
            setUser(user)
            const { post, comments } = await fetchUniquePost(id)
            setPost(post)
            setComments(comments)
            post.comments = comments
        }
        callback()
         
    }, [])

  return (
    <div>
        <NavBar authUser={user}></NavBar>
        {post ? <Post { ...post }></Post> :
        <div>Still loading..</div>}
    </div>
  )
}
