const _ = require('lodash');
const NUMBER_OF_CONTAINERS = 3;
const NUMBER_OF_MOVES = 10;

const getRandomNumber = exclude => {
  const randomNumber = _.random(NUMBER_OF_CONTAINERS - 1);
  return randomNumber === exclude ? getRandomNumber(exclude) : randomNumber;
};

const getSingleMove = () => {
  const startingPosition = getRandomNumber();
  const endingPosition = getRandomNumber(startingPosition);

  return [startingPosition, endingPosition];
};

const getAllMoves = () => _.times(NUMBER_OF_MOVES, getSingleMove);

const generatePath = (req, res) => {
  res.send({
    path: getAllMoves()
  });
};

module.exports = generatePath;
