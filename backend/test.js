const bcrypt = require('bcrypt');

const password = "admin123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) console.error(err);
  else console.log("New Hashed Password:", hash);
});
