const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const users = [
  { id: '23', firstName: 'Nikita', age: 22 },
  { id: '47', firstName: 'Samantha', age: 21 },
];

// Какие параметры user имеет внутри себя
const UserType = new GraphQLObjectType({
  // Имя
  name: 'User',
  fields: {
    // Параметры которые имеет Имя
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

// Входная точка в графе, чтобы было понятно откуда искать
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Если ищем 'user' и передаем 'id' => UserType
    user: {
      // Какой тип вернется на запрос с 'args'
      type: UserType,
      // Какие аргументы прокидывать надо
      args: { id: { type: GraphQLString } },
      // Здесь происходит поиск данных в DB
      resolve(parentValue, args) {
        // поиск первого найденного user с id = args.id
        return _.find(users, { id: args.id });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
