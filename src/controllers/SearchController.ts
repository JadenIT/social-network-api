import UserModel from '../models/UserModel'
import { Request, Response } from 'express'

class SearchController {
    public searchByQueryForUsernameOrFullName(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const { query } = req.query
            const q = new RegExp(query, 'i')
            UserModel.find(
                { $or: [{ username: q }, { fullname: q }], },
                { password: 0 }, (err: any, docs: any) => {
                    if (err) reject(err)
                    resolve(docs)
                }
            )
        }).then(Arr => res.send({ search: Arr }))
    }
}

const SearchControllerInstance: SearchController = new SearchController()

export default SearchControllerInstance
