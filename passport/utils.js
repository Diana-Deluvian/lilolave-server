const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const PRIV_KEY = process.env.PRIV_KEY || fs.readFileSync('passport/id_rsa_priv.pem', 'utf8');

const generatePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password + process.env.PEPPER, salt);
    return hashedPassword;
}

const issueJWT = (user) => {
    const _id = user._id;
  
    const expiresIn = '365d';
  
    const payload = {
      sub: _id,
      iat: Date.now()
    };
  
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
  
    return {
      token: "Bearer " + signedToken,
      expires: expiresIn
    }
}

module.exports.issueJWT = issueJWT;
module.exports.generatePassword = generatePassword;