import { Request, Router, Response } from 'express'

export interface Req extends Request {
    auth: {
        username: String,
        auth: Boolean,
        user_id: any
    },
    files: any
}

export interface Res extends Response {

}

export interface RouterInterface {
    router: Router
    routes: Function
}

export interface User {
    fullname?: String,
    avatar?: any,
    username?: String,
    about?: String,
    password?: any
}