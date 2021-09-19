const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public/posts`);
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname.split(".")[0]}-${
      file.fieldname
    }-${Date.now()}.${file.mimetype.split("/")[1]}`;
    cb(null, filename);
  },
});

exports.upload = multer({ storage: storage });
