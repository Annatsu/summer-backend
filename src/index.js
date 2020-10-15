// Node Modules
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Database Models
const { Sums } = require('./models');

// Instantiate Express app.
const app = express();

// Define middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route sums endpoint.
app
  .route(`${process.env.API_ENDPOINT}/sums`)
  .get(async (_, res) => {
    const results = await Sums.findAll({ order: [['created_at', 'DESC']], limit: 10 });
    res.status(200).json({ error: null, payload: results });
  })
  .post(async (req, res) => {
    const { num_a, num_b } = req.body;

    if (!(isArrayOfNumbers(num_a) || isArrayOfNumbers(num_b))) {
      return res.status(400).json({ error: 'Provided parameters must be an array of numbers.', payload: null });
    }

    const createdSumRow = await Sums.create({
      num_a: parseInt(num_a.join(''), 10),
      num_b: parseInt(num_b.join(''), 10),
      result: add(num_a, num_b),
    });

    res.status(201).json({ error: null, payload: createdSumRow });
  });

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log('Server started');
});

/**
 * Sums two arrays of numbers.
 *
 * @param {Array<Number>} a - an array representing the numbers to be summed
 * @param {Array<Number>} b - an array representing the numbers to be summed
 *
 * @return {Number} - addition result.
 */
function add(a, b) {
  let sumLeft = 0;

  const ra = a.reverse();
  const rb = b.reverse();
  const biggerArrayRef = a.length > b.length ? ra : rb;

  return parseInt(
    biggerArrayRef.reduce((acc, _, i, arr) => {
      const colResult = (ra[i] || 0) + (rb[i] || 0) + sumLeft;

      if (colResult > 9) {
        sumLeft = 1;
        acc = `${colResult % 10}${acc}`;
      } else {
        sumLeft = 0;
        acc = `${colResult}${acc}`;
      }

      if (arr.length === i + 1 && sumLeft) {
        acc = `${sumLeft}${acc}`;
      }

      return acc;
    }, ''),
    10,
  );
}

/**
 * Check if the passed variable is an array and is made of numbers.
 *
 * @param {any} a - variable to be verified
 *
 * @return {Boolean}
 */
function isArrayOfNumbers(a) {
  return Array.isArray(a) && a.every((n) => typeof n === 'number');
}
