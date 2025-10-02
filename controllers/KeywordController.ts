import { Request, Response, NextFunction } from 'express';
import { getDb } from '../config';
import { error } from 'console';


// THIS IS A STUB FILE. The applicant needs to implement the logic.

export const createKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const { name } = req.body;
        if (!name || typeof name !== 'string'){
            return res.status(400).json({message: "Keyword 'name' is required and must be a string."})
        }

        const db = getDb();
        const keywordsRef = db.collection('keywords');

        const newKeyword = {
            name, 
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await keywordsRef.add(newKeyword);

        res.status(201).json({ id: docRef.id, ...newKeyword});
    }catch (error){
        next(error)
    }
};


export const getKeywords = async (req: Request, res: Response, next: NextFunction) => {
    try {
    
    const db = getDb();
    let query: FirebaseFirestore.Query = db.collection('keywords');

    //Filtering Logic 
    const { isActive, sortBy, sortOrder, page, limit } = req.query;
    
    if (isActive !== undefined) {
        const activeBool = isActive === 'true';
        query = query.where('isActive', '==', activeBool);

    }


    //Sorting Logic 
 
    const orderField = sortBy === 'name' || sortBy === 'createdAt' ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'desc' ? 'desc' : 'asc';
    query = query.orderBy(orderField as string, orderDirection as FirebaseFirestore.OrderByDirection);
    
    const snapshot = await query.get();
    
    //Pagination Logic
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    const keywords = snapshot.docs
        .map(doc=> ({id: doc.id, ...doc.data() }))
        .slice(offset, offset + limitNum);

    
    res.status(200).json(keywords);
    } catch (error) {
        next(error);
    }
};

export const getKeywordById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message : "Keyword ID is required "});
        }

        const db = getDb();
        const docRef = db.collection("keywords").doc(id);
        const doc = await docRef.get();

        if (!doc.exists){
            return res.status(404).json({ message : "Keyword is not found. " });

        }

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        next(error);
    }
};

export const updateKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { id } = req.params;
        const { name } = req.body;

        if (!id) {
            return res.status(400).json({ message : "Keyword is required" });
         }

        if (!name || typeof name !== "string") {
            return res.status(400).json({ message : "Valid 'name' is required" });
        }

        const db = getDb();
        const docRef = db.collection("keywords").doc(id);
        const doc = await docRef.get();

        if (!doc.exists){
            return res.status(404).json({ message : "Keyword not found" });
        }

        await docRef.update({ name });

        res.status(201).json({ id, name, ...doc.data()});
    } catch (error) {
        next(error);
    }
};

export const updateKeywordStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const { id } = req.params;
       const { isActive } = req.body;

       if (!id){
        return res.status(400).json({message : "Keyword ID is required"});
    }
       if (typeof isActive !== "boolean"){
        return res.status(400).json({ message : "'isActive' must be a boolean (true/false)"});
       } 
    
       const db = getDb();
       const docRef = db.collection("keywords").doc(id);
       const doc =  await docRef.get();

       if (!doc.exists) {
        return res.status(404).json({ message : "Keyword not found" });
       }

       await docRef.update({ isActive, updatedAt: new Date() });

        res.status(200).json({ id, ...doc.data(), isActive });
    } catch (error) {
        next(error);
    }
};

export const deleteKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message : "Keyword ID is required"});
        }

        const db = getDb();
        const docRef = db.collection("keywords").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message : "Keyword not found "});
        }

        await docRef.delete();

        res.status(200).json({ message: `Keyword with ID ${id} has been deleted` });
    } catch (error) {
        next(error);
    }
};
