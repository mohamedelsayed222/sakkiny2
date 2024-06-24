export const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch((err) => {
        // console.log(err)
        return next(new Error(err,{cause:200}))
        })
    }
}

export const globalErrorHandling = (err, req, res, next) => {
    if (err) {
        if (req.validationErrors) {
            // console.log(req.validationErrors);
            return res.status(err['cause']|| 200)
            .json({ status:false,message: req.validationErrors })
        }
    return res.status(err['cause'] || 200).json({
    status:false,
    message:err.message,
    err,
    stack:err.stack,
        })
    }
}
