const PReportModel = require('../models/PReportModel')

class PrayReportController{
    static async create(req, res) {
        try {
            const prayerReportData = {
                ...req.body
            };
 
            const prayerReport = await PReportModel.create(prayerReportData);
            console.log("prayer report req submitted", prayerReport);
            res.status(201).json({
                success: true,
                data: prayerReport
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
           
           const prayers = await PReportModel.getAll(page, limit);
           
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

   static async delete(req, res) {
    try {
        const deleted = await PReportModel.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Prayer report request not found'
            });
        }
 
        res.json({
            success: true,
            message: 'Prayer report request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
 }
}
module.exports = PrayReportController;