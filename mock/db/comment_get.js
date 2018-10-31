var Mock = require('mockjs');

module.exports = Mock.mock({
    "error": 0,
    "message": "success",
    "result|40": [{
        "author": "@name",
        "comment": "@cparagraph",
        "date": "@datetime"
    }]
});