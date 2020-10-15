'use strict';
module.exports = (sequelize, DataTypes) => {
  const questions = sequelize.define(
    'Sums',
    {
      num_a: DataTypes.INTEGER,
      num_b: DataTypes.INTEGER,
      result: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      updatedAt: false,
    },
  );

  return questions;
};
