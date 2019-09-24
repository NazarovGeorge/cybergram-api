exports.upload = (req, res, next) => {
  const files = req.files;
  const keys = Object.keys(files);
  if (keys.length == 0) {
    return res.status(400).json({
      success: false,
      validate: [
        {
          field: 'photo',
          message: 'Изображене обязательно',
        },
      ],
    });
  } else if (
    files[keys[0]].mimetype !== 'image/png' &&
    files[keys[0]].mimetype !== 'image/jpeg' &&
    files[keys[0]].mimetype !== 'image/jpg'
  ) {
    return res.status(400).json({
      success: false,
      validate: [
        {
          field: 'photo',
          message: 'Допустимые форматы изображения - png, jpeg, jpg',
        },
      ],
    });
  } else if (files[keys[0]].truncated) {
    return res.status(400).json({
      success: false,
      validate: [
        {
          field: 'photo',
          message: 'Максимальный размер изображения - 3мб',
        },
      ],
    });
  }
  req.files[keys[0]].name = Date.now() + '_' + files[keys[0]].name;
  next();
};
