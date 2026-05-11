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
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
    
    console.log(`[BOOKING INQUIRY] to: senvetcare@gmail.com & drtbsmemorialvetclinic@gmail.com`);
    console.log(`From: ${firstName} ${lastName}`);
    console.log(`Email: ${email}, Phone: ${phone}`);
    console.log(`Message: ${message}`);
    
    // In a production environment, you would use a mailer service here.
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      try {
        // Send to clinic
        await resend.emails.send({
          from: 'Sen Vet Care <onboarding@resend.dev>', // Update with verified domain in production
          to: ['senvetcare@gmail.com', 'drtbsmemorialvetclinic@gmail.com'],
          subject: `New Booking/Inquiry from ${firstName} ${lastName}`,
          html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Phone:</strong> ${phone}</p>
                 <br/><p><strong>Message:</strong></p>
                 <p>${message}</p>`
        });
        
        // Confirmation to user
        if (email) {
          await resend.emails.send({
            from: 'Sen Vet Care <onboarding@resend.dev>', // Update with verified domain in production
            to: [email],
            subject: `Confirmation: We received your inquiry - Sen Vet Care`,
            html: `<p>Dear ${firstName},</p>
                   <p>Thank you for reaching out to Sen Vet Care. We have received your inquiry/booking request and our clinical team will get back to you shortly.</p>
                   <br/>
                   <p><strong>Your Message:</strong></p>
                   <p>${message}</p>
                   <br/>
                   <p>Best Regards,</p>
                   <p>Sen Vet Care Team</p>`
          });
        }
      } catch (err) {
        console.error("Failed to send booking emails via Resend:", err);
      }
    }
    
    res.json({ success: true, message: "Your inquiry has been sent to our clinical team." });
  });

  // Triage Report Email
  app.post("/api/triage/email", async (req, res) => {
    const { email, ownerName, pdfBase64, petName } = req.body;
    
    if (process.env.RESEND_API_KEY && email) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      try {
        await resend.emails.send({
          from: 'Sen Vet Care <onboarding@resend.dev>',
          to: [email],
          subject: `AI Triage Report for ${petName} - Sen Vet Care`,
          html: `<p>Dear ${ownerName},</p>
                 <p>Please find attached the AI Triage Report for your pet, <strong>${petName}</strong>.</p>
                 <p>If the report indicates an emergency, please call our clinic immediately.</p>
                 <br/>
                 <p>Best Regards,</p>
                 <p>Sen Vet Care Team</p>`,
          attachments: [
            {
              filename: `${petName}_Triage_Report.pdf`,
              content: pdfBase64.split('base64,')[1] || pdfBase64,
            }
          ]
        });
        res.json({ success: true });
      } catch (err) {
        console.error("Failed to send triage report email:", err);
        res.status(500).json({ success: false, error: "Email delivery failed" });
      }
    } else {
      res.json({ success: false, message: "RESEND_API_KEY not configured or email missing." });
    }
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
