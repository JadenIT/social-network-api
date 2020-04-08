import UserModel from '../models/UserModel'
import {Res, Req} from '../interfaces/index'

class SearchController {
    public async searchByQueryForUsernameOrFullName(req: Req, res: Res) {
        try {
            const {query} = req.query
            const q = new RegExp(query, 'i')
            const docs = await UserModel.find({$or: [{username: q}, {fullname: q}],}, {password: 0});
            res.send({search: docs})
        } catch (e) {
            res.send({status: 'Error'})
        }
    }
}

const SearchControllerInstance: SearchController = new SearchController()

export default SearchControllerInstance
