const { onGenerateRandomString } = require("./functionName");
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'ddzmeaxld', 
  api_key: '474589438589538', 
  api_secret: '0y4_UPL1HqhHOzKlLaBZZfozPWQ' 
});

exports.onUploadImages = async (files, folder) => {
    try {
        if (files && files.length > 0) {
            const folderName = 'images/upload/' + folder;
            let images = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = onGenerateRandomString(10);
                const result = await cloudinary.uploader.upload(file.path, {
                    public_id: `${folderName}/${fileName}`,
                });

                images.push(result.secure_url);
            }
            return images;
        } else {
            return [];
        }
    } catch (e) {
        console.log("Lỗi " + e);
        return false;
    }
}
