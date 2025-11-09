import multer from "multer";
import path from "path"
import fs from "fs"


const uploadDir = path.join(process.cwd(), "public", "images", "cars");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${base}${ext}`); 
  },
});


const upload = multer({ storage: storage });

export { upload }