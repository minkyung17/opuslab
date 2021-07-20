module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    /*"extends": "eslint:recommended",*/
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        //disabling since we have both mac/linux and windows users
        /*
        "linebreak-style": [
            "error",
            "unix"
        ],
        */
        "semi": [
            "error",
            "always"
        ],
        "quotes": [
            "error",
            "double"
        ],
        
    }
};