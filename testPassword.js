//เราไม่มี register มีเเค่ login เลย hash passwordเเล้วยัดใน database ตรงๆ

const bcrypt = require('bcrypt');

// Generate a salt to use in hashing
const saltRounds = 10; // This determines the complexity of the hashing algorithm
const plainTextPassword = 'password123'; // Replace this with the desired password for your test user

// Hash the password
bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});
