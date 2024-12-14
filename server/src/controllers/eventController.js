const EventModel = require('../models/EventModel');

class EventController {
   static async create(req, res) {
       try {
           const event = await EventModel.create({
               ...req.body,
               coordinator_id: req.user.id
           });

           res.status(201).json({
               success: true,
               data: event
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
           
           const events = await EventModel.getAll(page, limit);
           
           res.json({
               success: true,
               data: events || []
           });
       } catch (error) {
            console.log(error);
           res.status(500).json({
               success: false,
               message: 'Error Fetching events',
               error: error.message
           });
       }
   }

   static async getById(req, res) {
       try {
           const event = await EventModel.findById(req.params.id);
           
           if (!event) {
               return res.status(404).json({
                   success: false,
                   message: 'Event not found'
               });
           }

           res.json({
               success: true,
               data: event
           });
       } catch (error) {
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async update(req, res) {
       try {
           const updated = await EventModel.update(req.params.id, req.body);
           
           if (!updated) {
               return res.status(404).json({
                   success: false,
                   message: 'Event not found'
               });
           }

           res.json({
               success: true,
               message: 'Event updated successfully'
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
           const deleted = await EventModel.delete(req.params.id);
           
           if (!deleted) {
               return res.status(404).json({
                   success: false,
                   message: 'Event not found'
               });
           }

           res.json({
               success: true,
               message: 'Event deleted successfully'
           });
       } catch (error) {
            console.log(error);
           res.status(500).json({
               success: false,
               message: error.message
           });
       }
   }

   static async getUpcoming(req, res) {
       try {
           const page = parseInt(req.query.page) || 1;
           const limit = parseInt(req.query.limit) || 10;
           
           const events = await EventModel.getUpcoming(page, limit);
           
           res.json({
               success: true,
               data: events
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
           const stats = await EventModel.getStats();
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
}

module.exports = EventController;