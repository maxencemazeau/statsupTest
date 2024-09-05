const ConvertPhotoToUri = (image) => {
    const photoBase64 = image.toString('base64');
    const photoDataUri = `data:image/jpeg;base64,${photoBase64}`;
    return photoDataUri
}

module.exports = { ConvertPhotoToUri }