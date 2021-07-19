const Constants = require('./constants');

let isEmptyObj = function (obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
let shuffleArray = function (array) {
    var currentIndex = array.length, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

let chooseRandom = function (array) {
    return array[Math.floor(Math.random() * array.length)];
}

let isSpecialCard = function (card) {
    return Constants.CARD_TYPE.SPECIAL.includes(card.rank + card.suit);
}

module.exports.isEmptyObj = isEmptyObj;
module.exports.shuffleArray = shuffleArray;
module.exports.chooseRandom = chooseRandom;
module.exports.isSpecialCard = isSpecialCard;
