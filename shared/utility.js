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

module.exports.isEmptyObj = isEmptyObj;
module.exports.shuffleArray = shuffleArray;
