var path = require('path')
  , fs = require('fs')
  , async = require('async')
  , im = require('imagemagick')
  , sanitize = require("sanitize-filename")
  , srcPath = '/images/slides/'
  , outputBasePath = path.resolve(__dirname, '../../public' + srcPath)
  ;

exports.toJpgs = function (filePath, callback) {
  var imagePath
    , outputPath
    , dirname = Date.now().toString()
    ;

  if (path.extname(filePath) !== '.pdf') {
    console.log('file is not valid')
    return callback(new TypeError(filePath + ' must be pdf.'));
  }

  outputPath = path.join(outputBasePath, dirname);
  imagePath = path.join(outputPath, 'slide') + '.jpg';

  async.waterfall([
    function (next) {
      fs.mkdir(outputPath, function (err, data) {
        next(err, data);
      });
    },
    function (data, next) {
      im.convert([filePath, imagePath], function (err, stdout) {
        next(err, stdout);
      });
    },
    function (stdout, next) {
      fs.unlink(filePath);
      var src = path.join(srcPath, dirname);
      fs.readdir(outputPath, function (err, files) {
        var dataset = {}
          ;

        files = (files || []).map(function (v) {
          return path.resolve(src, v);
        });

        dataset.slides = files;
        dataset.id = dirname;
        next(err, dataset);
      });
    }
  ], function (err, res) {
    return callback(err, res);
  });
};
