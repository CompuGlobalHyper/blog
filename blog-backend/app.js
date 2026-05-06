import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import client from './db/client.js'
import cors from 'cors'

import routes from './routes/homeRoutes.js'


import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'

const app = express()
app.use(passport.initialize())
app.use(express.json())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser())
const clientUrl = process.env.CLIENT_URL
app.use(cors({
  origin: clientUrl,
  credentials: true
}))


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await client.findUserByName(username)
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
        if (!match) {
                return done(null, false, { message: "Incorrect password" })
           }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['access_token']
        return token

    } else {
        console.log('No token found..')
        return token
    }
}

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    const user = await client.findUserById(payload.id)
    return user ? done(null, user) : done(null, false)
  }
))

app.use(routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});

