/* asyncHandler
   Wraps async route handlers and forwards errors to the
   global Express error handler automatically
   */
module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};