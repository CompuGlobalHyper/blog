import { prisma } from '../lib/prisma.js'

export default {
     async findUserByName(username) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username
                }
            })
            return user
        } catch (err) {
            console.log(err)
        }

    },
    async findUserById(id) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            })
            return user
        } catch (err) {
            console.log(err)
        }

    },
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany({})
            return users
        } catch (err) {
            console.log(err)
            return null
        }
    },
    async initUser(username, password) {
        try {
                await prisma.user.create({
                data: {
                    username,
                    password,
                    status: 'user',
                }
            })
        } catch(err) {
            console.log(err)
            return null
        }
    },
    async getPosts() {
        try {
            const posts = await prisma.post.findMany({
            })
            return posts
        } catch(err) {
            return err
        }
    },
    async getPost(id) {
        try {
            const post = await prisma.post.findUnique({
                where: {
                    id
                }
            })
            return post
        } catch (err) {
            console.log(err)
            return null
        }
    },
    async getComments(id) {
        try {
            const comments = await prisma.comment.findMany({
                where: {
                    postId: id
                }
            })
            return comments
        } catch (err) {
            console.log(err)
            return null
        }
    },
    async changePost(id, boolean) {
        try {
            await prisma.post.update({
                where: {
                    id
                },
                data: {
                    published: boolean
                }
            })
        }
        catch(err) {
            console.log(err)
            console.log('could not change publish trait')
        }
    },
    async addPost(title, body, published, userId, createdAt, edited) {
        try {
            const post = await prisma.post.create({
                data: {
                    title,
                    body,
                    published,
                    userId,
                    createdAt,
                    edittedAt: edited
                }
            })
            return post
        } catch (err) {
            console.log(err)
            console.log('failed to create new post')
        }
    }
}