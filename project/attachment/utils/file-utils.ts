module.exports = {
    generateUniqueFileName(originalFilename: string, processId: string) {
        const filenameParts = originalFilename.split('.');
        return `${processId}_${btoa(originalFilename)}.${filenameParts[filenameParts.length - 1]}`;
    }
}