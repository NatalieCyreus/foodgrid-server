const graphql = require('graphql');
const _= require('lodash');

const Recipe = require('../models/recipe');
const User = require('../models/user');
const Comment = require('../models/comment');
const AuthService = require('../services/auth');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLSchema } = graphql;


const RecipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    category: { type: new GraphQLList(GraphQLString) },
    about: { type: GraphQLString },
    ingredients: { type: new GraphQLList(GraphQLString) },
    directions: { type: new GraphQLList(GraphQLString) },
    likes: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent) {
        return Recipe.findComments(parent.id);
      }
    },
  })
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    text: { type: GraphQLString },
    id: { type: GraphQLID },
    UserId: { type: GraphQLID },
    recipe: {
      type: RecipeType,
      resolve(parentValue) {
        return Comment.findById(parentValue).populate('Recipe')
          .then(comment => {
            console.log(comment)
            return comment.recipe
          });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    about: { type: GraphQLString },
    followers: { type: GraphQLInt },
    recipes: {
      type: new GraphQLList(RecipeType),
      resolve(parent, args) {
        return Recipe.find({userId: parent.id});
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    recipe: {
      type: RecipeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Recipe.findById(args.id);
      }
    },
    loggedInUser: {
      type: UserType,
      resolve(parent, args, req) {
        return req.user;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return User.findById(args.id);
      }
    },
    recipes: {
      type: new GraphQLList(RecipeType),
      resolve(parent, args) {
        return Recipe.find({});
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }
    },
    comment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parnetValue, { id }) {
        return Comment.findById(id);
      }
    }
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        about: { type: GraphQLString },
      },
      resolve(parent, { email, password, username }, req) {
        return AuthService.signup({ email, password, username, req });
      }
    },
    logout: {
      type: UserType,
      resolve(parent, args, req) {
        const { user } = req;
        req.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { email, password }, req) {
        return AuthService.login({ email, password, req });
      }
    },
    addRecipe: {
      type: RecipeType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLList(GraphQLString) },
        about: { type: new GraphQLNonNull(GraphQLString) },
        ingredients: { type: new GraphQLList(GraphQLString) },
        directions: { type: new GraphQLList(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let recipe = new Recipe({
          title: args.title,
          category: args.category,
          about: args.about,
          ingredients: args.ingredients,
          directions: args.directions,
          likes: 0,
          userId: args.userId
        });
        return recipe.save();
      }
    },
    addCommentToRecipe: {
      type: CommentType,
      args: {
        text: { type: GraphQLString },
        recipeId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(parent, { text, recipeId, userId }) {
        return Recipe.addComment(text, recipeId, userId);
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
