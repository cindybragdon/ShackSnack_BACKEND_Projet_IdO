export const errorMiddlewaresHandler = (error, req, res, next) => {
    console.error(`We have an error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
};