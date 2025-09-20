import multer from "multer";

const storage = multer.memoryStorage(); // store files in memory buffer
export const singleUpload = multer({ storage }).single("file"); // `file` must match frontend field name
