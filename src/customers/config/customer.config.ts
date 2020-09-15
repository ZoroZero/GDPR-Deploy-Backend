
import { diskStorage } from 'multer';
import { editImportServerFileName, csvFileFilter } from 'src/helper/helper';

// Multer configuration
export const multerConfig = {
    dest: process.env.SERVER_FOLDER,
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits

    // Storage properties
    storage: diskStorage({
        destination: './files/customer',
        // File modification details
        filename: editImportServerFileName
        },
    ),
    fileFilter: csvFileFilter,
};