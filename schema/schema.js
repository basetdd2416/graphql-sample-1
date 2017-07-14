const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = graphql;

const BASE_API_URI = "http://localhost:3000";

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`${BASE_API_URI}/companies/${parentValue.id}/users`)
                    .then(resp => resp.data)
                    .catch(err => err)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`${BASE_API_URI}/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)
                    .catch(err => err);
            }
        }
    }
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${BASE_API_URI}/users/${args.id}`)
                    .then(resp => resp.data)
                    .catch(err => err)
            }
        },
        company: {
            type: CompanyType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios.get(`${BASE_API_URI}/companies/${args.id}`)
                    .then(resp => resp.data)
                    .catch(err => err);
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        addUser: {
            type: UserType /*may be a same type of action endpoint*/ ,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                companyId: {
                    type: GraphQLString
                },
            },
            resolve(parentValue, {
                firstName,
                age
            }) {
                // inject some api here
                return axios.post(`${BASE_API_URI}/users`, {
                        firstName,
                        age
                    })
                    .then(resp => resp.data)
                    .catch(err => err);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parentValue, {
                id
            }) {
                return axios.delete(`${BASE_API_URI}/users/${id}`)
                    .then(resp => resp.data)
                    .catch(err => err);
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                firstName: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, {
                id,
                firstName,
                age
            }) {
                return axios.put(`${BASE_API_URI}/users/${id}`, {
                        firstName,
                        age
                    })
                    .then(resp => resp.data)
                    .catch(err => err);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});