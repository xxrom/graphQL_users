const graphql = require('graphql');
const axios = require('axios');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

// Какие параметры user имеет внутри себя
const UserType = new GraphQLObjectType({
  // Имя
  name: 'User',
  fields: {
    // Параметры которые имеет Имя
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // Связываем user с company, чтобы граф понимал чё куда
    company: {
      type: CompanyType,
      /*
       * Так как 'company' нет у 'User', то нужно как-то ему подкинуть этот тип
       * Поэтому мы сами делаем запрос на сервер и получаем данные
       */
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
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
      // Здесь происходит поиск данных в DB (promise)
      resolve(parentValue, args) {
        // поиск первого найденного user с id = args.id
        return (
          axios
            .get(`http://localhost:3000/users/${args.id}`)
            // axios вернет структуру { data: {...server.ans}}
            .then((resp) => resp.data)
        );
      },
    },
    // Ищем 'сompany'
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      // Здесь происходит поиск данных в DB (promise)
      resolve(parentValue, args) {
        // поиск первого найденного company с id = args.id
        return (
          axios
            .get(`http://localhost:3000/companies/${args.id}`)
            // axios вернет структуру { data: {...server.ans}}
            .then((resp) => resp.data)
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
