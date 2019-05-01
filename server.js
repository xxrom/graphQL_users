const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
const PORT = 4000;

/*
  переходим на loaclhost:4000/qraphql
  и там вводим query:
  {
    # по field: user ищем его с id: 23
    # и возвращаем параметры id, ...
    user(id: "23") {
      id,
      firstName,
      age
  }
}
*/

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true, // Only for Dev
  })
);

app.listen(PORT, () => {
  console.log(`listening on Port:${PORT}!`);
});
