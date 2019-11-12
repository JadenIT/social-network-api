import UserModel from '../models/UserModel'
import { Request, Response } from 'express'

class SearchController {
    public searchByQueryForUsernameOrFullName(req: Request, res: Response) {
        try {
            const { query } = req.query
            const q = new RegExp(query, 'i')
            UserModel.find(
                {
                    $or: [{ username: q }, { fullname: q }],
                },
                {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                },
                (error: any, docs: any) => {
                    if (error) res.send({ status: 'error', error })
                    res.send({ search: docs })
                }
            )
        } catch (error) {
            res.send({ status: 'error', error })
        }
    }
}

const SearchControllerInstance: SearchController = new SearchController()

export default SearchControllerInstance
