//async handler to handle all the async functions in the applications

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
            catch((err) => next(err));
    }
}   
export { asyncHandler }