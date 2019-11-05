import UserModel from '../models/UserModel'

class SearchController {
    public searchByQueryForUsernameOrFullName(query: String) {
        return new Promise((resolve, reject) => {
            const q = new RegExp(query)
            UserModel.find(
                {
                    $or: [{ username: q }, { fullname: q }]
                },
                {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                },
                (error: any, docs: any) => {
                    if (error) return reject(error)
                    resolve(docs)
                }
            )
        })
    }
}

const SearchControllerInstance: SearchController = new SearchController()

export default SearchControllerInstance
