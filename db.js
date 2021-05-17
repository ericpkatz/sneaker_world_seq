const Sequelize = require('sequelize');
const { STRING } = Sequelize.DataTypes;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/sneaker_world_db' );

const data = [
  { name: 'Air Max', brand: 'Nike' },
  { name: 'Air Jordan', brand: 'Nike' },
  { name: 'Stan Smiths', brand: 'Converse' },
  { name: 'Chuck Taylor', brand: 'Converse' },
  { name: 'Cons', brand: 'Converse' },
];

const Sneaker = conn.define('sneaker', {
  name: STRING,
  brand: STRING

});


const syncAndSeed  = async()=> {
  await conn.sync({ force: true });
  await Promise.all(
    data.map( sneaker => Sneaker.create(sneaker))
  );
};


module.exports = {
  syncAndSeed,
  models: {
    Sneaker
  }
};
