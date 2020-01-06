import UserModel from '../models/UserModel'
import { Res, Req } from '../interfaces/index'

class SearchController {
    public searchByQueryForUsernameOrFullName(req: Req, res: Res) {
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
