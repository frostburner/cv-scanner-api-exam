import { Request, Response, NextFunction } from 'express';
import pdf from 'pdf-parse';
import { getDb } from '../config';
import { match } from 'assert';

// THIS IS A STUB FILE. The applicant needs to implement the logic.

export const scanCv = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No CV file uploaded.' });
        }

        const data = await pdf(req.file.buffer);
        const cvText = data.text;
        
        const emailMatch = cvText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (!emailMatch) {
            return res.status(400).json({ message : 'No email found in cv'});

        }
        const email = emailMatch[0];

        const firstLine = cvText.split('\n').find(line => line.trim() !== '');
        let extractedName = '';
        if (firstLine) {
            const words = firstLine.split(' ').filter(w => !w.includes(email));
            extractedName = words.slice(0,2).join(' ');
        }

        const db = getDb();
        const keywordsSnapshot = await db.collection('keywords')
            .where('isActive', "==", true)
            .get();
        const keywords = keywordsSnapshot.docs.map(doc => doc.data().name.toLowerCase());

        const matchedKeywords: string[] = [];
        const lowerText = cvText.toLowerCase();
        for (const keyword of keywords){
            if (lowerText.includes(keyword)){
                matchedKeywords.push(keyword);
            }
        }

        const scannedCvREf = db.collection('scanned_cvs').doc(email);
        const scannedCvData = {
            email, 
            extractedName,
            matchedKeywords,
            fullText: cvText,
            scannedAt: new Date(),
            updatedAt: new Date()
        };

        await scannedCvREf.set(scannedCvData);

      res.status(201).json(scannedCvData);
    } catch (error) {
        next(error);
    }
};

export const rescanCv = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required for rescan.' });
        }

        const db = getDb();
        const cvRef = db.collection('scanned_cvs').doc(email);
        const cvDoc = await cvRef.get();

        if (!cvDoc.exists){
            return res.status(404).json({ message: 'Scanned CV is not found' });
        }

        const cvData = cvDoc.data();
        if (!cvData || !cvData.fullText){
            return res.status(400).json({message: 'CV is missing for rescanning'}); 
        }

        const fullText = cvData.fullText.toLowerCase();

        //Fetching Active Keywords logic
        
        const keywordsSnapshot = await db.collection('keywords')
            .where('isActive', '==', true)
            .get();
        
        const keywords = keywordsSnapshot.docs.map(doc => doc.data().name.toLowerCase());

        //Re-running matches logic
        const matchedKeywords: string[] = [];
        for (const keyword of keywords) {
            if (fullText.includes(keyword)) {
                matchedKeywords.push(keyword);
            }
        }

        //Update Document logic

        const updatedData = {
            ...cvData,
            matchedKeywords,
            updatedAt: new Date()
        };

        await cvRef.set(updatedData);

        
        res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
};
