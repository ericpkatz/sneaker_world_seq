const express = require('express');
const app = express();

const { syncAndSeed, models: { Sneaker } } = require('./db');


app.get('/', (req, res)=> res.redirect('/sneakers'));

app.get('/sneakers', async(req, res, next)=> {
  try {
    const sneakers = await Sneaker.findAll();
    const mapped = sneakers.reduce((acc, sneaker)=> {
      const key = sneaker.brand;
      acc[key] = acc[key] || [];
      acc[key].push(sneaker);
      return acc;
    }, {});
    res.send(`
      <html>
        <head>
          <title>Sneakers</title>
        </head>
        <body>
          <h1>Sneaker World (${ sneakers.length })</h1>
          <ul>
            ${
              Object.entries(mapped).map( entry => {
                const brand = entry[0];
                const sneakers = entry[1];
                return `
                  <li>
                    <a href='/sneakers/${brand}'>${ brand } (${sneakers.length})</a>
                  </li>
                `;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/sneakers/:brand', async(req, res, next)=> {
  try {
    const brand = req.params.brand;
    const sneakers = await Sneaker.findAll({
      where: {
        brand
      }
    });
    res.send(`
      <html>
        <head>
          <title>Sneakers (${brand})</title>
        </head>
        <body>
          <h1>Sneaker World (${ sneakers.length })</h1>
          <h2><a href='/sneakers'>${ brand }</a></h2>
          <ul>
            ${
              sneakers.map( sneaker => {
                return `
                  <li>${ sneaker.name }</li>
                `;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});


const run = async()=> {
  try {
    await syncAndSeed();
    console.log('synced and seeded');
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

run();
