const UserModel = require('../models/UserModel');
const { generateToken } = require('../config/jwt');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  

class AuthController {
   static async register(req, res) {
       try {
            console.log('Register method called');
           const { name, email, password } = req.body;

           const existingUser = await UserModel.findByEmail(email);
           if (existingUser) {
               return res.status(400).json({
                   success: false,
                   message: 'Email already registered'
               });
           }

           const user = await UserModel.create({
               name,
               email,
               password,
               role: 'member',
               status: 'active'
           });

           const token = generateToken(user);  
           
           res.status(201).json({
               success: true,
               data: { user, token }
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async login(req, res) {
       try {
           const { email, password } = req.body;
           console.log('Login method called');

           const user = await UserModel.findByEmail(email);
           if (!user) {
               return res.status(401).json({
                   success: false,
                   message: 'Invalid credentials'
               });
           }

           const isValidPassword = await bcrypt.compare(password, user.password);
           if (!isValidPassword) {
               return res.status(401).json({
                   success: false,
                   message: 'Invalid credentials'
               });
           }

           const token = generateToken(user);  

           res.json({
               success: true,
               data: {
                   user: {
                       id: user.id,
                       name: user.name,
                       email: user.email,
                       role: user.role
                   },
                   token
               }
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async googleCallback(req, res) {
       try {
            const token = jwt.sign(
                {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // Redirect to frontend with the token
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
       } catch (error) {
           console.error('Google callback error:', error);
           // Redirect to login if an error occurs during the callback
           res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
       }
   }

   static async logout(req, res) {
       res.json({
           success: true,
           message: 'Logged out successfully'
       });
   }
}

module.exports = AuthController;
