const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'avatars');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

module.exports = multer({
  storage,
  fileFilter
});
