import app from './app';
import { initializeFirebase } from './config';

const PORT = process.env.PORT || 8081;

// Initialize Firebase Admin SDK
try {
    initializeFirebase();
    console.log('Firebase Admin SDK initialized successfully.');
    
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

} catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    process.exit(1);
}
