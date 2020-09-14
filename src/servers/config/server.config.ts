import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
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
        // Destination storage path details
        // destination: (req: any, file: any, cb: any) => {
        //     const uploadPath = multerConfig.dest;
        //     // Create folder if doesn't exist
        //     // if (!existsSync(uploadPath)) {
        //     //     mkdirSync(uploadPath);
        //     // }
        //     cb(null, uploadPath);
        // },
        destination: './files/server',
        // File modification details
        filename: editImportServerFileName
        },
    ),
    fileFilter: csvFileFilter,
};