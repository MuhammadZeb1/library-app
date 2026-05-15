import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File type check
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG images are allowed!"));
  }
}

// Upload config
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

export default upload;