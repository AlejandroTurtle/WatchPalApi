import multer from "multer";

// só memória, sem escrever nada no disco
const storage = multer.memoryStorage();

export const uploadSinglePhoto = multer({ storage }).single("foto");
