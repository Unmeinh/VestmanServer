const { onGenerateRandomString } = require("./functionName");
// import { getStorage, ref } from "firebase/storage";

// // Create a root reference
// const storage = getStorage();

// // Create a reference to 'mountains.jpg'
// const mountainsRef = ref(storage, 'mountains.jpg');

// // Create a reference to 'images/mountains.jpg'
// const mountainImagesRef = ref(storage, 'images/mountains.jpg');

// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name;           // true
// mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 

exports.onUploadImages = async (files, folder) => {
    try {
        if (files && files.length > 0) {
            const folderName = 'images/upload/' + folder;
            let images = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = onGenerateRandomString(10);
                
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
