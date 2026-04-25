import express from "express";
import cors from "cors";
import path from "path";
import cron from "node-cron";
import { createServer as createViteServer } from "vite";
import { generateDailyBlog } from "./src/services/blogCron";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example API trigger for the cron job (for testing manually)
  app.post("/api/blogs/generate", async (req, res) => {
    try {
      await generateDailyBlog();
      res.json({ success: true, message: "Blog generated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to generate blog" });
    }
  });

  // Booking/Contact Form Submission
  app.post("/api/booking", async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
    
    console.log(`[BOOKING INQUIRY] to: drtbsmemorialvetclinic@gmail.com`);
    console.log(`From: ${firstName} ${lastName}`);
    console.log(`Email: ${email}, Phone: ${phone}`);
    console.log(`Message: ${message}`);
    
    // In a production environment, you would use a mailer service here.
    // For now, we simulate success.
    
    res.json({ success: true, message: "Your inquiry has been sent to our clinical team." });
  });

  // Set up the daily cron job (runs every day at midnight)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily blog generation cron job...");
    try {
      await generateDailyBlog();
    } catch (err) {
      console.error("Daily blog generation failed:", err);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
