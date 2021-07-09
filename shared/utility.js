let isEmptyObj = function(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
module.exports.isEmptyObj = isEmptyObj;
