export const errorHandler = (errMessage, errStatus) => {
    const newErr = new Error(errMessage);
    newErr.statusCode = errStatus;
    return newErr;
}