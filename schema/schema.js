const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const BASE_API_URI = "http://localhost:3000";

const CompanyType =  new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    }
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
            resolve(parentValue,args) {
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
            resolve(parentValue,args) {
                return axios.get(`${BASE_API_URI}/companies/${args.id}`)
                .then(resp => resp.data)
                .catch(err => err);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});