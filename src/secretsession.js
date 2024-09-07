const crypto = require('crypto');

// Membuat secret key sepanjang 32 byte dan mengkonversinya menjadi string hexadecimal
const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);
