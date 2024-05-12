export const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch((err) => {
        // console.log(err)
        return next(new Error(err,{cause:400}))
        })
    }
}

export const globalErrorHandling = (err, req, res, next) => {
    if (err) {
        if (req.validationErrors) {
            return res.status(err['cause']|| 400)
            .json({ message: req.validationErrors })
        }
    return res.status(err['cause'] || 500).json({
    message:err.message,
    err,
    stack:err.stack,
        })
    }
}
