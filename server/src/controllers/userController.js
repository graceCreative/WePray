const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');

class UserController {
   static async getProfile(req, res) {
       try {
           const user = await UserModel.findById(req.user.id);
           if (!user) {
               return res.status(404).json({ message: 'User not found' });
           }
           delete user.password;
           res.json({ success: true, data: user });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async updateProfile(req, res) {
       try {
           const updates = {};
           if (req.body.name) updates.name = req.body.name;
           if (req.body.email) updates.email = req.body.email;
           if (req.body.password) {
               updates.password = await bcrypt.hash(req.body.password, 10);
           }

           const user = await UserModel.update(req.user.id, updates);
           delete user.password;
           res.json({ success: true, data: user });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async updateStatus(req, res) {
       try {
           const { userId } = req.params;
           const { status } = req.body;

           const user = await UserModel.updateStatus(userId, status);
           res.json({ success: true, data: user });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async updateRole(req, res) {
       try {
           const { userId } = req.params;
           const { role } = req.body;

           // Only admin can assign coordinator role
           if (role === 'coordinator' && req.user.role !== 'admin') {
               return res.status(403).json({ message: 'Unauthorized to assign coordinator role' });
           }

           const user = await UserModel.updateRole(userId, role);
           res.json({ success: true, data: user });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async getStats(req, res) {
       try {
           const stats = await UserModel.getStats();
           
           // Filter stats based on user role
           if (req.user.role !== 'admin') {
               delete stats.total_coordinators;
           }
           
           res.json({ success: true, data: stats });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async getMembers(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const members = await UserModel.getByRole('member', page, limit)
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

   static async getPendingMembers(req, res) {
       try {
           const page = parseInt(req.query.page) || 1;
           const limit = parseInt(req.query.limit) || 10;
           const members = await UserModel.getByStatus('pending', page, limit);
           res.json({ success: true, data: members });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async getCoordinators(req, res) {
       try {
           const page = parseInt(req.query.page) || 1;
           const limit = parseInt(req.query.limit) || 10;
           const coordinators = await UserModel.getByRole('coordinator', page, limit);
           res.json({ success: true, data: coordinators });
       } catch (error) {
           res.status(500).json({ message: error.message });
       }
   }

   static async delete(req, res) {
        try {
            const deleted = await UserModel.delete(req.params.userId);
            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({success: true, message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = UserController;