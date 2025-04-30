const FormData = require("form-data");
const stream = require("stream");
const axios = require("axios");

exports.uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Missing image file" });
    }

    try {
        const formData = new FormData();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        formData.append("file", bufferStream, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const imageResponse = await axios.post(
            process.env.BASE_URL_ZIPLINE + "/api/upload",
            formData,
            {
                headers: {
                    Authorization: process.env.TOKEN_ZIPLINE,
                    ...formData.getHeaders(),
                },
            }
        );

        req.imageUrl = imageResponse.data.files[0];

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Upload failed", error: err.message });
    }
};

