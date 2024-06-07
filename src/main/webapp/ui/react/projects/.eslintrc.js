/*eslint-env es6*/
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    /*"extends": "eslint:recommended",*/
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
    },
    "parser": "babel-eslint",
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