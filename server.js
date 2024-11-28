var express = require("express")

var { createHandler } = require("graphql-http/lib/use/express")

var { buildSchema } = require("graphql")
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type User {
    id: ID!
    name: String!
    email: String!
    }
    type Query {
    hello: String
    getUser(id: ID!): User
    getUsers: [User]
    }
    type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    }
    `);// The root provides a resolver function for each API endpoint
var root = {
hello() {
return "Hello world!"
},
}
var app = express()
// Create and use the GraphQL handler.
app.all(
"/graphql",
createHandler({
schema: schema,
rootValue: root,
})
)
// Start the server at port
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")