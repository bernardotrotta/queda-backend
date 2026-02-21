const errorHandler = (err, req, res, _next) => {
    res.status(err.status || 500).json({
        error: err.message,
        details: err.details,
    })
}

export { errorHandler }
