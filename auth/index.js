const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { loginCred, accessToken } = require('../config');
const jwt = require("jsonwebtoken");


const verifyCred = async ( {username, password} ) => {
    if (!username || !password || 
        loginCred.username !== username || 
        loginCred.password !== password ) {
        return Promise.reject(new Error("Invalid Credentials."))
    }
    
    return Promise.resolve()
};

const multipleLogIns = () => {
    if(loginCred.loggedIn === 1)
        return true;
    
    process.env['LOGGEDIN'] = 1
    return false
}

const jwtOpts = {
    algorithm: "HS256",
    expiresIn: "2m",
    // notBefore: ""
};


const generateJWT = async (username) => {
  
    const token = jwt.sign({ username }, accessToken, jwtOpts);
    
    return token
};

const loginHandler = async function(req, res, next) {
    const { username, password } = req.body;
    
    try {
        await verifyCred( {username, password} );
        const token = await generateJWT(username);

        res.json({token: token}).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(401); 
    }
};


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = accessToken;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    
    console.log(jwt_payload)
    // done(null, false, { message: 'Force error.' })
    done(null, true);
}));

exports.loginHandler = loginHandler;
