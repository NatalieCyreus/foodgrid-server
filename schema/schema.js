const graphql = require('graphql');
const _= require('lodash');

const Recipe = require('../models/recipe');
const User = require('../models/user');
const Ingredient = require('../models/ingredient');

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
    category: { type: new GraphQLList(GraphQLString)},
    about: { type: GraphQLString },
    ingredients: {
      type: new GraphQLList(IngredientType),
      resolve(parent) {
        return Recipe.findIngredients(parent.id);
      }
    },
    directions: { type: new GraphQLList(GraphQLString)},
    likes: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      }
    }
  })
});

const IngredientType = new GraphQLObjectType({
  name: 'Ingredient',
  fields: () => ({
    text: { type: GraphQLString },
    id: { type: GraphQLID },
    complete: { type: GraphQLBoolean },
    recipe: {
      type: RecipeType,
      resolve(parentValue) {
        return Ingredient.findById(parentValue).populate('Recipe')
          .then(ingredient => {
            console.log(ingredient)
            return ingredient.recipe
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
    ingredient: {
      type: IngredientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parnetValue, { id }) {
        return Ingredient.findById(id);
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
        directions: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let recipe = new Recipe({
          title: args.title,
          category: args.category,
          about: args.about,
          directions: args.directions,
          likes: 0,
          userId: args.userId
        });
        return recipe.save();
      }
    },
    addIngredientToRecipe: {
      type: RecipeType,
      args: {
        text: { type: GraphQLString },
        complete: { type: GraphQLBoolean },
        recipeId: { type: GraphQLID }
      },
      resolve(parent, { text, recipeId, complete }) {
        return Recipe.addIngredient(text, recipeId, complete);
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
