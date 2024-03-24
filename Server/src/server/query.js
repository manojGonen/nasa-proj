DEFAULT_PAGE_NUMBER = 1;
DEFAULT_LIMIT = 0;

function pagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_LIMIT;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }
}

module.exports = {
    pagination
};