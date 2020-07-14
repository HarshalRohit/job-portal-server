const multer  = require('multer');

const storageOpts = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        const  uploadDir = __dirname + "/../uploads"
        cb(null, uploadDir) 
    }, 
    filename: function (req, file, cb) {
      const date = new Date();
      let origFileName = file.originalname;
      origFileName = origFileName.slice(0, origFileName.lastIndexOf('.'));
      
      const fileName = `${origFileName}-${date.toGMTString()}.pdf`;
    
      cb(null, fileName) 
    } 
  });
  
  const limitOpts = {fileSize: 1 * 1000 * 1000 * 1000};
  // const fileFilter = (req, res, cb) => {
  // };
  
  const multerOptions = {
    storage: storageOpts,
    limits: limitOpts 
  };

  module.exports = multer(multerOptions);