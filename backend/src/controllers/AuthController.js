import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  const { name, email, password, role, contact } = req.body;
  const targetEmail = email || contact; // Support both frontend naming conventions

  try {
    if (!targetEmail) return res.status(400).json({ msg: "Email is required" });

    const userExists = await User.findOne({ email: targetEmail });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    // SOVEREIGN ADMIN SECURITY: Only Kushal can be Admin
    let finalRole = 'customer';
    if (role === 'admin' && targetEmail === 'kushalkrishna161616@gmail.com') {
      finalRole = 'admin';
    } else if (role === 'admin') {
       return res.status(403).json({ msg: 'Access Denied: Admin privileges reserved for the Founder.' });
    }

    const user = await User.create({ name, email: targetEmail, password, role: finalRole });

    if (user) {
      res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ msg: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password, contact } = req.body;
  const targetEmail = email || contact;

  try {
    const user = await User.findOne({ email: targetEmail });

    if (!user) {
      return res.status(401).json({ msg: 'No boutique profile found with this email.' });
    }

    // CHECK FOR GOOGLE-ONLY ACCOUNTS
    if (!user.password && user.googleId) {
      return res.status(401).json({ 
        msg: 'This profile is secured via Google. Please use the Google Authentication button to continue.' 
      });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ msg: 'Invalid credentials. Please verify your secure key.' });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(401).json({ msg: `Login failed: Please verify your credentials.` });
  }
};

// @desc    Get user profile (Private)
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client("676042233490-s3j8il8bbmhlebj7egivkt00b014dhed.apps.googleusercontent.com");

// @desc    Auth with Google
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
  const { token, role, intent } = req.body;
  
  try {
    console.log(`📍 Google Auth [${intent}] Attempt for Audience:`, "676042233490-s3j8il8bbmhlebj7egivkt00b014dhed.apps.googleusercontent.com");
    if(!token) return res.status(400).json({ msg: "No token provided from frontend" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "676042233490-s3j8il8bbmhlebj7egivkt00b014dhed.apps.googleusercontent.com",
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();
    console.log("✅ Token Verified for:", email);
    
    let user = await User.findOne({ email });
    
    // EXCLUSIVE LOGIC: If intent is login, user MUST exist
    if (!user && intent === 'login') {
       return res.status(404).json({ msg: "No boutique profile found. Please 'Create a Profile' first to join the ecosystem." });
    }

    if (!user) {
      // SOVEREIGN ADMIN SECURITY: Only Kushal can be Admin via Google too
      let finalRole = 'customer';
      if (email === 'kushalkrishna161616@gmail.com') {
        finalRole = 'admin';
      }

      user = await User.create({
        name,
        email,
        googleId,
        role: finalRole,
        isVerified: true 
      });
      console.log("✨ New Profile Created via Google:", email);
    } else {
       // AUTO-UPGRADE: Always ensure Kushal is Admin
       if (email === 'kushalkrishna161616@gmail.com' && user.role !== 'admin') {
         user.role = 'admin';
         await user.save();
       }
    }

    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    });
    
  } catch (error) {
    console.error("❌ GOOGLE AUTH CRASH:", error.message);
    res.status(401).json({ msg: `Google Authentication failed: ${error.message}` });
  }
};

import nodemailer from 'nodemailer';

// MOCK OTP STORAGE (In-memory for testing)
const otpStorage = new Map();

// @desc    Send OTP for password recovery
// @route   POST /api/auth/forgot-password/send-otp
export const forgotPasswordSendOtp = async (req, res) => {
  const { email } = req.body;
  if(!email) return res.status(400).json({ msg: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No boutique profile found." });

    // Generate a secure 4-digit recovery code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStorage.set(email, otp);

    // CONFIGURE THE MAIL ENGINE
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // CRAFT THE ELITE RECOVERY EMAIL
    const mailOptions = {
      from: `"Kushalzz Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🛡️ Secure Recovery: Your Kushalzz Boutique Access Code",
      html: `
        <div style="font-family: 'Playfair Display', serif; padding: 40px; background-color: #fcfcfc; border: 1px solid #d69e4c; border-radius: 20px; color: #111;">
          <h1 style="text-align: center; color: #111; text-transform: uppercase; letter-spacing: 0.3em; font-size: 24px; font-weight: 300;">Kushalzz Marketplace</h1>
          <div style="height: 1px; width: 60px; background-color: #d69e4c; margin: 20px auto;"></div>
          <p style="text-align: center; font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: #666; margin-bottom: 40px;">Accessing the Boutique Collection</p>
          
          <div style="background-color: #fff; padding: 30px; border-radius: 15px; border: 1px solid #f0f0f0; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
            <p style="color: #999; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 20px;">Your Secure Recovery Code</p>
            <h2 style="font-size: 48px; color: #d69e4c; margin: 10px 0; letter-spacing: 0.4em;">${otp}</h2>
            <p style="font-size: 11px; color: #bbb; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 20px;">Use this key to restore your sovereignty in the boutique ecosystem.</p>
          </div>
          
          <p style="text-align: center; color: #666; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5em; margin-top: 50px;">Kushalzz Marketplace • Elite</p>
        </div>
      `,
    };

    // SEND THE EMAIL
    await transporter.sendMail(mailOptions);
    console.log(`✅ Secure Code Delivered to: ${email}`);

    res.status(200).json({ msg: "Secure Recovery Code has been transmitted to your Gmail." });
  } catch (error) {
    console.error("❌ MAIL DELIVERY FAILURE:", error.message);
    res.status(500).json({ msg: `Failed to deliver recovery code: ${error.message}` });
  }
};

// @desc    Verify OTP and update password
// @route   POST /api/auth/forgot-password/verify-otp
export const forgotPasswordVerifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const storedOtp = otpStorage.get(email);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ msg: "Invalid or expired recovery code." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User died in transition. Try again." });

    // Update password (pre-save hook in User.js will hash it)
    user.password = newPassword;
    await user.save();
    
    // Clear used OTP
    otpStorage.delete(email);

    res.status(200).json({ msg: "Sovereignty Restored. Access Granted." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
