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
    var users = [];
    var idCounter = 1;
    var root = {
    hello() {
    return "Hello world!";
    },
    createUser({ name, email }) {
    const user = { id: idCounter++, name, email };
    users.push(user);
    return user;
    },
    updateUser({ id, name, email }) {
    const user = users.find((user) => user.id == id);
    if (!user) {
    throw new Error("User not found");
    }
    if (name) {
    user.name = name;
    }
    if (email) {
    user.email = email;
    }
    return user;
    },
    getUser({ id }) {
    return users.find((user) => user.id == id);
    },
    getUsers() {
    return users;
    },
    };
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