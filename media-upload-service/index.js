const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'user_avatars' }, 
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file received' });
        }

        console.log("File received from Gateway, uploading to Cloudinary...");
        const result = await uploadToCloudinary(req.file.buffer);

        console.log("Upload success:", result.secure_url);
        res.json({
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Media Service running on port ${PORT}`);
});