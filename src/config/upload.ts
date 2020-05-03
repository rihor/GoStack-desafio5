import crypto from 'crypto';
import { diskStorage } from 'multer';
import { resolve } from 'path';

export const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  storage: diskStorage({
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(8).toString('HEX');
      const fileName = `${fileHash}_${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
