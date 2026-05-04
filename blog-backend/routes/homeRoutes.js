import express from 'express'
import passport from 'passport'
import controller from '../controllers/controllers.js'

const router = express.Router()

const authUser = passport.authenticate(
        "jwt", { session: false }
    )

const authAdmin = (req, res, next) => {
    const user = req.user
        if (!user || user.status !== 'author') {
            console.log('no admin authorization')
            return res.sendStatus(403)
        } else {
            console.log('admin confirmed')
            next()
        }
}

router.get('/', controller.indexGet)

router.post('/login', 
    passport.authenticate(
    "local", { session: false }),
    controller.loginPost)

router.post('/register', controller.registerPost)

router.get('/home', authUser, controller.homeGet)

router.get('/view/:id', authUser, controller.viewGet)

router.get('/logout', controller.logoutGet)

router.get('/me', authUser, controller.meGet)

router.post('/init', controller.initPost)

router.get('/admin', authUser, authAdmin, controller.adminHomeGet)

router.post('/update/:id', authUser, authAdmin, controller.updatePost)

router.post('/add', authUser, authAdmin, controller.addPost)

export default router