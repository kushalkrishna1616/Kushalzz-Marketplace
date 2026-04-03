import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const promoteUser = async () => {
    try {
        await connectDB();
        
        const email = process.argv[2];
        if (!email) {
            console.error('❌ Please provide an email: node src/promote.js user@example.com');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`✅ SUCCESS: ${email} is now an ADMIN! 🥂🏛️🔑`);
        } else {
            console.log(`❌ ERROR: User with email ${email} not found.`);
        }
        
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

promoteUser();
