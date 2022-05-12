import { randomBytes } from 'crypto';
import { resolve } from 'path';
import multer from 'multer';

const tmpFolfer = resolve(__dirname, '..', '..', 'tmp');
export default {
  directory: tmpFolfer,
  storage: multer.diskStorage({
    destination: tmpFolfer,
    filename(request, file, callback) {
      const fileHash = randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
