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
           
           const prayers = await PrayerModel.getAll();
           console.log("prayerWall", prayers);
           res.json({
               success: true,
               data: prayers
           });
       } catch (error) {
            console.log("error in getAll", error);
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async getAllApprovedPrayers(req, res) {
        try {
            
            const prayers = await PrayerModel.getAllApprovedPrayers();
            
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
            const prayers = await PrayerModel.getAllApprovedPraises();
            
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

   static async updateMessage(req, res) {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const updatedPrayer = await PrayerModel.updateMessage(req.params.id, message);
        
        if (!updatedPrayer) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }

        res.json({
            success: true,
            data: updatedPrayer,
            message: 'Prayer message updated successfully'
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

   static async updatePrayerCount(req, res) {
    try{
        const { id } = req.params;
        const { updatedCount } = req.body.data;
        const numericPrayCount = Number(updatedCount);
        
        if (isNaN(numericPrayCount)) {
            console.log(numericPrayCount);
            return res.status(400).json({
                success: false,
                message: 'Invalid prayer count'
            });
        }
        const updated = await PrayerModel.updatePrayerCount(id, updatedCount);
        console.log("type of count received in backend",typeof numericPrayCount);
        res.json({
            success: true,
            data: updated
        })
    }  catch (error) {
        console.error("backend Error:", error.message)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
   }

//    static async updateReportedCount(req, res) {
//     try{
//         const { reportCount } = req.body;
//         const updated = await PrayerModel.updateReportedCount(req.params.id, reportCount);
//         res.json({
//             success: true,
//             data: updated
//         })
//     }  catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
//    }

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