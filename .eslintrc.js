module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base/legacy",
    "rules": {
        "no-console": ["warn", { "allow": ["log"] }]
    },
    "parserOptions": {
        "sourceType": "module"
    }
};
