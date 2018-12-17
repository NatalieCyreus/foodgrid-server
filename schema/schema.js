const graphql = require('graphql');
const _= require('lodash');

const Recipe = require('../models/recipe');
const User = require('../models/user');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema } = graphql;


const RecipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    category: { type: new GraphQLList(GraphQLString)},
    about: { type: GraphQLString },
    ingredients: { type: new GraphQLList(GraphQLString)},
    directions: { type: new GraphQLList(GraphQLString)},
    likes: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        //return _.find( users, { id: parent.userId } );
        return User.findById(parent.userId);
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
        //return _.filter(recipes, { userId: parent.id })
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
        //code to get data from db / other source
        //return _.find(recipes, {id: args.id});
        return Recipe.findById(args.id);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        //return _.find(users,{ id:args.id });
        return User.findById(args.id);
      }
    },
    recipes: {
      type: new GraphQLList(RecipeType),
      resolve(parent, args) {
        //return recipes
        return Recipe.find({});
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        //return users
        return User.find({});
      }
    }
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        about: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let user = new User({
          email: args.email,
          username: args.username,
          name: args.name,
          about: args.about,
          followers: 0
        });
        return user.save();
      }
    },
    addRecipe: {
      type: RecipeType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        about: { type: new GraphQLNonNull(GraphQLString) },
        ingredients: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        directions: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
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
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
