/**
 * Wraps message with one backtick.
 * @constructor
 * @param {string} message - message to be wrapped.
 */
module.exports.wrapWithOBT = function(message) {
    return "`" + message + "`";
}
/**
 * Wraps message with three backticks.
 * @constructor
 * @param {string} message - message to be wrapped.
 */
module.exports.wrapWithTBT = function(message) {
    return "```" + message + "```";
}
/**
 * Wraps message with code syntax highlighting.
 * @constructor
 * @param {string} language - language that would be highlighted.
 * @param {string} message - message to be wrapped.
 */
module.exports.wrapWithCSH = function (language, message) {
    return "```" + language + "\n" + message + "```";
}