import { Router } from 'express';
import multer from 'multer';
import * as scanController from './controllers/ScannerController';

const router = Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    }
});

router.post('/scan', upload.single('cv'), scanController.scanCv);
router.post('/rescan', scanController.rescanCv);


export default router;
