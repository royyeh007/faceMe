
const Sequelize = require('sequelize')
const db = require('../db')

const Image = db.define('image', {
  name: {
    type: Sequelize.STRING,
  },
  base64: {
    type: Sequelize.TEXT,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
}})

module.exports = Image

