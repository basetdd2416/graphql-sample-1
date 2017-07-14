const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const BASE_API_URI = "http://localhost:3000";

const users = [{
        id: '23',
        firstName: 'apisit',
        age: 30
    },
    {
        id: '50',
        firstName: 'sin',
        age: 55
    }
]

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
        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});