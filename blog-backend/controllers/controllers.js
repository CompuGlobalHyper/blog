import passport from 'passport'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import client from '../db/client.js'
import jwt from 'jsonwebtoken'


const userMapFn = async () => {
    const userMap = {}
        const userList = await client.getAllUsers()
        userList.forEach((user) => {
            userMap[user.id] = user.username
        })
    return userMap
}
export default {
    indexGet(req, res) {
        res.json({ message: 'get request on home page' })
    },
    async loginPost(req, res) {
        const user = req.user
        console.log(user)
        if (!user) {
            console.log('login failed')
            return res.status(400).json({auth: false})
        }
        jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '1hr'}, (err, token) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ auth: false });
            }
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                maxAge: 600000 // 10 mins
            })
            console.log('login successful, token created')
            return res.status(200).json({auth: true})
        })
    },
    async registerPost(req, res) {
        if (!req.body.username || !req.body.password) return null
        const username = req.body.username
        const password = await bcrypt.hash(req.body.password, 10)
        const user = client.initUser(username, password)
        if (!user) {
            return null
        }
        return res.status(200).json({reg: true})
    },
    async homeGet(req, res) {
        const userMap = await userMapFn()
        const user = req.user
        if (!user) {
            console.log('please login')
            return res.sendStatus(403)
        }
        const posts = await client.getPosts()
        const postsWithUsers = posts.map(post => ({
            ...post, username: userMap[post.userId] || "Unknown"
        }))
        return res.status(200).json({ postsWithUsers })
    },
    async viewGet(req, res) {
        const userMap = await userMapFn()
        const user = req.user
        if (!user) {
            res.sendStatus(403)
            console.log('please login')
        }
        const id = req.params.id
        const post = await client.getPost(id)
        post.username = userMap[post.userId]
        const unNamedComments = await client.getComments(id)
        const users = await client.getAllUsers()
        const comments = unNamedComments.map((comment) => {
            const userId = comment.userId
            const user = users.find((user) => user.id === comment.userId)
            return {...comment, author: user ? user.username : 'Unknown'}
        })
        if (post) {
            return res.status(200).json({ post, comments })
        } else {
            return res.status(500).json({ post, comments })
        }
    },
    async logoutGet(req, res) {
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "strict", // must match how you set it
            secure: false,   // true in production (HTTPS)
            path: '/',
        });
        console.log('logging you out..')
        res.sendStatus(200)
    },
    async meGet(req, res) {
        const user = req.user
        if (user) {
            return res.status(200).json( { username: user.username, status: user.status })
        } else {
            return res,status(401)
        }
        

    },
    async initPost(req, res)  {
        const password = await bcrypt.hash('12345', 10)
        try {
            await client.initUser('Phin', password)
            return
        } catch(err) {
            console.log('already initialized..')
            console.log(err)
            return
        }
    },
    async adminHomeGet(req, res) {
        const userMap = userMapFn()
        const user = req.user
        if (!user || user.status !== 'author') {
            console.log('no admin authorization')
            return res.sendStatus(403)
        }
        const posts = await client.getPosts()
        const postsWithUsers = posts.map(post => ({
            ...post, username: userMap[post.userId] || "Unknown"
        }))
        return res.status(200).json({ postsWithUsers })
    },
    async updatePost(req, res) {
        const id = req.params.id
        const { published } = req.body
        await client.changePost(id, published)
        const posts = await client.getPosts()
        console.log('successfully updated post')
        console.log(posts)
        return res.status(200).json({ posts })
    },
    async addPost(req, res) {
        const { title, body, published } = req.body
        const userId = req.user.id
        const createdAt = new Date()
        const edited = null
        const newPost = await client.addPost(title, body, published, userId, createdAt, edited)
        return res.status(200).json({ title })
    }
}