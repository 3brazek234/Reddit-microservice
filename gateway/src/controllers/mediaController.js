// src/controllers/mediaController.js
const axios = require('axios');
const FormData = require('form-data'); 

const uploadMedia = async (req, res) => {
  try {
    const file = req.file;
    
    // تأكد إن الملف وصل
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const uploading = await axios.post("http://localhost:3005/upload", formData, {
      headers: {
        // ✅ الصح: سيب المكتبة تحط الهيدرز والـ Boundary بنفسها
        ...formData.getHeaders(), 
      },
    });

    const imageUrl = uploading.data.url;
    console.log("Image uploaded to Media Service:", imageUrl);

    res.status(200).json({ 
        message: "File uploaded successfully", 
        url: imageUrl 
    });

  } catch (error) {
    console.error("Upload Error Details:", error.message);
    if (error.response) {
        console.error("Response form Media Service:", error.response.data);
    }
    
    res.status(500).json({ error: "Failed to upload file" });
  }
};

module.exports = {
  uploadMedia,
};