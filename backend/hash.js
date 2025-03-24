const bcrypt = require('bcrypt');

const users = [
  { username: 'user1', email: 'user1@example.com', password: 'password1' },
  { username: 'user2', email: 'user2@example.com', password: 'password2' },
  { username: 'user3', email: 'user3@example.com', password: 'password3' },
  { username: 'user4', email: 'user4@example.com', password: 'password4' },
  { username: 'user5', email: 'user5@example.com', password: 'password5' },
  { username: 'user6', email: 'user6@example.com', password: 'password6' },
  { username: 'user7', email: 'user7@example.com', password: 'password7' },
  { username: 'user8', email: 'user8@example.com', password: 'password8' },
  { username: 'user9', email: 'user9@example.com', password: 'password9' },
  { username: 'user10', email: 'user10@example.com', password: 'password10' },
];

const hashPasswords = async () => {
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
    console.log(`('${user.username}', '${user.email}', '${user.password}', 0, 0),`);
  }
};

hashPasswords();
