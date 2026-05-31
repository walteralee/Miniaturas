import path from "path";

import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(
      null,

      path.join(process.cwd(), "..", "almacenamiento", "miniaturas"),
    );
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname);

    cb(null, `temp${extension}`);
  },
});

export const subirMiniatura = multer({ storage });
