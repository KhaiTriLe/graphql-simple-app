var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");

// tao schema
var schema = buildSchema(`
    type User {
        id: ID!
        username: String!
        description: String!
    }
    type Query {
        getUser(id: ID!): User
        getUsers: [User]
    }
    type Mutation {
        createUser(username: String!, description: String!): User
        updateDescription(id: ID!, description: String!): User
    }
`);

// in-memory db
var users = [];
var idCounter = 1;

// xu ly tung api
var root = {
    getUser({ id }) {
        return users.find((user) => user.id == id);
    },
    getUsers() {
        return users;
    },
    createUser({ username, description }) {
        const user = { id: idCounter++, username, description };
        users.push(user);
        return user;
    },
    updateDescription({ id, description }) {
        const user = users.find((user) => user.id == id);
        if (!user) {
            throw new Error("User not found");
        }
        user.description = description;
        return user;
    },
};

var app = express();

// tao handler
app.all(
    "/graphql",
    createHandler({
        schema: schema,
        rootValue: root,
    })
);

// chay server 
app.listen(4000, () => {
    console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});