const PrayerModel = require('../models/PrayerModel');

class PrayerController {
    static async create(req, res) {
        try {
            const prayerData = {
                ...(req.user ? { user_id: req.user.id } : {}),
                ...req.body
            };
 
            const prayer = await PrayerModel.create(prayerData);
            console.log("prayer req submitted");
            res.status(201).json({
                success: true,
                data: prayer
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

   static async getAll(req, res) {
       try {
           const page = parseInt(req.query.page) || 1;
           const limit = parseInt(req.query.limit) || 10;
           
           const prayers = await PrayerModel.getAll(page, limit);
           
           res.json({
               success: true,
               data: prayers
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async getAllApprovedPrayers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const prayers = await PrayerModel.getAllApprovedPrayers(page, limit);
            
            res.json({
                success: true,
                data: prayers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getAllApprovedPraises(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const prayers = await PrayerModel.getAllApprovedPraises(page, limit);
            
            res.json({
                success: true,
                data: prayers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

   static async getById(req, res) {
       try {
           const prayer = await PrayerModel.findById(req.params.id);
           
           if (!prayer) {
               return res.status(404).json({
                   success: false,
                   message: 'Prayer request not found'
               });
           }

           res.json({
               success: true,
               data: prayer
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async updateStatus(req, res) {
       try {
           const { id } = req.params;
           const { status } = req.body;

           const updated = await PrayerModel.updateStatus(id, status, req.user.id);
           
           if (!updated) {
               return res.status(404).json({
                   success: false,
                   message: 'Prayer request not found'
               });
           }

           res.json({
               success: true,
               message: 'Status updated successfully'
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async getStats(req, res) {
       try {
           const stats = await PrayerModel.getStats();
           res.json({
               success: true,
               data: stats
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }


   static async delete(req, res) {
    try {
        const deleted = await PrayerModel.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }
 
        res.json({
            success: true,
            message: 'Prayer request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
 }

   static async getPending(req, res) {
       try {
           const page = parseInt(req.query.page) || 1;
           const limit = parseInt(req.query.limit) || 10;
           
           const prayers = await PrayerModel.getByStatus('pending', page, limit);
           
           res.json({
               success: true,
               data: prayers
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }
}


module.exports = PrayerController;