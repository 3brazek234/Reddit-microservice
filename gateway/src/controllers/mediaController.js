const uploadMedia = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const formDate = new FormData();
    formDate.append("file", req.file.buffer, req.file.originalname);
    const uploading = await axios.post("http://localhost:3005/", formDate, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const imageUrl = uploading.data.url;
    console.log("Image uploaded to Media Service:", imageUrl);
    res
      .status(200)
      .json({ message: "File uploaded successfully", file: req.file });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

module.exports = {
  uploadMedia,
};
