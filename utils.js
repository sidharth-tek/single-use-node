const getNanoId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

module.exports = {
    getNanoId
}