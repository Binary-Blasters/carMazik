const asyncHandler = (fn) => async(req, res , next) => {
    try {
        await fn(req, res, next)
        
    } catch (error) {
        console.log(error);
        const statusCode = error.statusCode || 500
        res
        .status(statusCode)
        .json({
            message : error.message,
            error
        })
        
    }
}

export {asyncHandler}