import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { createCalendarEvent, listCalendarEvents, deleteCalendarEvent, type CalendarEventData } from "./google-calendar";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/calendar/events", async (req, res) => {
    try {
      const eventData: CalendarEventData = req.body;
      
      if (!eventData.title || !eventData.startDate || !eventData.endDate) {
        return res.status(400).json({ error: "Missing required fields: title, startDate, endDate" });
      }

      const event = await createCalendarEvent(eventData);
      
      res.json({
        success: true,
        eventId: event.id,
        htmlLink: event.htmlLink,
      });
    } catch (error: any) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({ 
        error: "Failed to create calendar event",
        message: error.message 
      });
    }
  });

  app.get("/api/calendar/events", async (req, res) => {
    try {
      const maxResults = parseInt(req.query.maxResults as string) || 10;
      const events = await listCalendarEvents(maxResults);
      
      res.json({
        success: true,
        events,
      });
    } catch (error: any) {
      console.error("Error listing calendar events:", error);
      res.status(500).json({ 
        error: "Failed to list calendar events",
        message: error.message 
      });
    }
  });

  app.delete("/api/calendar/events/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      
      if (!eventId) {
        return res.status(400).json({ error: "Missing eventId parameter" });
      }

      await deleteCalendarEvent(eventId);
      
      res.json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting calendar event:", error);
      res.status(500).json({ 
        error: "Failed to delete calendar event",
        message: error.message 
      });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
