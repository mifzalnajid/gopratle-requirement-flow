function errorHandler(error, _req, res, _next) {
    console.error(error);

    if (error.name === "ValidationError") {
        return res.status(400).json({
            error: "The submitted requirement is invalid.",
        });
    }

    return res.status(500).json({
        error: "Unable to process the request.",
    });
}

module.exports = errorHandler;