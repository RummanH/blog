const { Router } = require('express');
const multer = require('multer');

const userRouter = require('./users.router');
const postRouter = require('./posts.router');
const commentRouter = require('./comment.router');
const AppError = require('../services/AppError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname.split('.')[0]}.jpeg`;
    cb(null, fileName);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] !== 'image') {
    cb(new AppError('Please upload only images!', 400));
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter: multerFilter });
const uploadSinglePhoto = upload.single('image');

const resizePhoto = (req, res, next) =>
  res
    .status(200)
    .json({ status: 'success', data: { image: req.file.filename } });

const router = Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.route('/upload').post(uploadSinglePhoto, resizePhoto);

module.exports = router;
