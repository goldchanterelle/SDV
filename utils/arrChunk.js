function arrChunk(arr, chunkSize) {
    if (chunkSize == 0) throw new Error('Chunk cannot be 0');
    let exportArr = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        // do whatever
        exportArr.push(chunk)
    }
    return exportArr
}

module.exports = { arrChunk }