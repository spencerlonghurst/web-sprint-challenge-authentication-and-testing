const db = require('../../data/dbConfig');

async function add(user) {
  const [id] = await db("users").insert(user)
  return findById(id)
}

function findBy(filter) {
  return db("users")
    .select("username", "password") // "u.id", 
    .where(filter)
}

function findById(id) {
  return db("users")
    .select('id', "username", "password" ) // "u.id"
    .where("id", id)
    .first()
}

module.exports = {
  findBy,
  add,
  findById
}