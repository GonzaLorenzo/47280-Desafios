const EErrors = 
{
	INVALID_PRODUCT_DATA: 1,
	INVALID_USER_DATA: 1,
}

export const errorHandler = (error, req, res, next) => 
{
    console.log(error.cause)
    switch (error.code) 
	{
        case EErrors.INVALID_USER_DATA:
            res.status(400).send({ status: "error", error: error.message });
            break;
		case EErrors.INVALID_PRODUCT_DATA:
			res.status(400).send({ status: "error", error: error.message });
			break;
        default:
            res.status(500).send({ status: "error", error: "Unhandled error" });
            break;
	}
}

export default EErrors;