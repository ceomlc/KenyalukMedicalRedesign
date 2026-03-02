import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  users, 
  sessions,
  events, 
  blogPosts, 
  donations, 
  volunteerSubmissions, 
  contactMessages,
  eventRegistrations,
  newsletterSubscribers,
  insertEventSchema,
  insertBlogPostSchema,
  insertDonationSchema,
  insertVolunteerSubmissionSchema,
  insertContactMessageSchema,
  insertEventRegistrationSchema,
  insertNewsletterSubscriberSchema,
} from "@shared/schema";
import { eq, and, desc, gte, sql, count, sum } from "drizzle-orm";
import Stripe from "stripe";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY must be set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover" as any,
});

const cloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const user = req.user;
      if (!user || (user.role !== "admin" && user.role !== "board_member")) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Events API
  app.get("/api/events/upcoming", async (req, res, next) => {
    try {
      const now = new Date();
      const result = await db.select()
        .from(events)
        .where(and(
          gte(events.date, now),
          eq(events.isActive, true)
        ))
        .orderBy(events.date)
        .limit(3);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/events", async (req, res, next) => {
    try {
      const { program } = req.query;
      
      let query = db.select().from(events).$dynamic();
      
      if (program && typeof program === 'string') {
        query = query.where(eq(events.program, program));
      }
      
      const result = await query.orderBy(desc(events.date));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/events/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await db.select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const body = { ...req.body };
      if (body.date && typeof body.date === "string") body.date = new Date(body.date);
      const validated = insertEventSchema.parse(body);
      const result = await db.insert(events)
        .values(validated)
        .returning();
      res.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  // Blog/News API
  app.get("/api/blog/latest", async (req, res, next) => {
    try {
      const result = await db.select()
        .from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(3);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/blog", async (req, res, next) => {
    try {
      const { category } = req.query;
      
      let query = db.select().from(blogPosts).$dynamic();
      
      if (category && typeof category === 'string') {
        query = query.where(eq(blogPosts.category, category));
      }
      
      const result = await query.orderBy(desc(blogPosts.publishedAt));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/blog/:slug", async (req, res, next) => {
    try {
      const { slug } = req.params;
      const result = await db.select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/blog", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const body = { ...req.body };
      if (body.publishedAt && typeof body.publishedAt === "string") body.publishedAt = new Date(body.publishedAt);
      const validated = insertBlogPostSchema.parse(body);
      const result = await db.insert(blogPosts)
        .values(validated)
        .returning();
      res.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  // Stripe Payment Intent for Donations
  app.post("/api/create-payment-intent", async (req, res, next) => {
    try {
      const { amount, donorName, donorEmail, isRecurring } = req.body;
      
      if (!amount || !donorName || !donorEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const amountInCents = Math.round(parseFloat(amount) * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          donorName,
          donorEmail,
          isRecurring: isRecurring ? "true" : "false",
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      next(error);
    }
  });

  // Stripe Webhook (for recording successful donations)
  app.post("/api/stripe-webhook", async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).send('Missing signature or webhook secret');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody as Buffer,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        if (paymentIntent.metadata.type === 'event_registration') {
          const regResults = await db.select().from(eventRegistrations)
            .where(eq(eventRegistrations.stripePaymentIntentId, paymentIntent.id))
            .limit(1);
          
          if (regResults.length > 0) {
            const reg = regResults[0];
            await db.update(eventRegistrations)
              .set({ status: "confirmed" })
              .where(eq(eventRegistrations.id, reg.id));
            
            await db.update(events)
              .set({ currentAttendees: sql`COALESCE(current_attendees, 0) + ${reg.numberOfAttendees || 1}` })
              .where(eq(events.id, reg.eventId));
          }
        } else {
          await db.insert(donations).values({
            amount: (paymentIntent.amount / 100).toString(),
            donorName: paymentIntent.metadata.donorName || 'Anonymous',
            donorEmail: paymentIntent.metadata.donorEmail,
            isRecurring: paymentIntent.metadata.isRecurring === 'true',
            status: 'completed',
            stripePaymentIntentId: paymentIntent.id,
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  });

  // Donations API
  app.get("/api/donations", async (req, res, next) => {
    try {
      const result = await db.select()
        .from(donations)
        .orderBy(desc(donations.createdAt));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/donations", async (req, res, next) => {
    try {
      const validated = insertDonationSchema.parse(req.body);
      const result = await db.insert(donations)
        .values(validated)
        .returning();
      res.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  // Volunteer Submissions API
  app.post("/api/volunteer-submit", async (req, res, next) => {
    try {
      const validated = insertVolunteerSubmissionSchema.parse(req.body);
      const result = await db.insert(volunteerSubmissions)
        .values(validated)
        .returning();
      res.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/volunteer-submissions", async (req, res, next) => {
    try {
      const result = await db.select()
        .from(volunteerSubmissions)
        .orderBy(desc(volunteerSubmissions.createdAt));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Contact Messages API
  app.post("/api/contact-submit", async (req, res, next) => {
    try {
      const validated = insertContactMessageSchema.parse(req.body);
      const result = await db.insert(contactMessages)
        .values(validated)
        .returning();
      res.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/contact-messages", async (req, res, next) => {
    try {
      const result = await db.select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Cloudinary Image API
  const requireCloudinary = (_req: any, res: any, next: any) => {
    if (!cloudinaryConfigured) {
      return res.status(503).json({ message: "Image hosting is not configured. Please add Cloudinary credentials." });
    }
    next();
  };

  app.get("/api/images", requireCloudinary, async (req, res) => {
    try {
      const folder = req.query.folder as string | undefined;
      const tag = req.query.tag as string | undefined;
      const maxResults = Math.min(parseInt(req.query.limit as string) || 30, 100);
      const nextCursor = req.query.cursor as string | undefined;

      let result;
      if (tag) {
        result = await cloudinary.api.resources_by_tag(tag, {
          max_results: maxResults,
          next_cursor: nextCursor,
          resource_type: "image",
        });
      } else {
        const options: any = {
          max_results: maxResults,
          next_cursor: nextCursor,
          resource_type: "image",
          type: "upload",
        };
        if (folder) {
          options.prefix = folder;
        }
        result = await cloudinary.api.resources(options);
      }

      const images = result.resources.map((img: any) => ({
        id: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
        format: img.format,
        folder: img.folder || "",
        alt: img.context?.custom?.alt || img.public_id.split("/").pop() || "",
        caption: img.context?.custom?.caption || "",
      }));

      res.json({
        images,
        nextCursor: result.next_cursor || null,
        totalCount: result.rate_limit_remaining,
      });
    } catch (error: any) {
      console.error("Error fetching Cloudinary images:", error);
      res.status(500).json({ message: "Failed to fetch images", error: error.message });
    }
  });

  app.get("/api/images/folders", requireCloudinary, async (_req, res) => {
    try {
      const result = await cloudinary.api.root_folders();
      const folders = result.folders.map((f: any) => ({
        name: f.name,
        path: f.path,
      }));
      res.json({ folders });
    } catch (error: any) {
      console.error("Error fetching Cloudinary folders:", error);
      res.status(500).json({ message: "Failed to fetch folders", error: error.message });
    }
  });

  app.get("/api/images/folder/:folder(*)", requireCloudinary, async (req, res) => {
    try {
      const folder = req.params.folder;
      const maxResults = Math.min(parseInt(req.query.limit as string) || 30, 100);
      const nextCursor = req.query.cursor as string | undefined;

      const [resources, subfolders] = await Promise.all([
        cloudinary.api.resources({
          max_results: maxResults,
          next_cursor: nextCursor,
          resource_type: "image",
          type: "upload",
          prefix: folder + "/",
        }),
        cloudinary.api.sub_folders(folder).catch(() => ({ folders: [] })),
      ]);

      const images = resources.resources.map((img: any) => ({
        id: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
        format: img.format,
        folder: img.folder || "",
        alt: img.context?.custom?.alt || img.public_id.split("/").pop() || "",
        caption: img.context?.custom?.caption || "",
      }));

      res.json({
        images,
        subfolders: subfolders.folders.map((f: any) => ({ name: f.name, path: f.path })),
        nextCursor: resources.next_cursor || null,
      });
    } catch (error: any) {
      console.error("Error fetching folder images:", error);
      res.status(500).json({ message: "Failed to fetch folder images", error: error.message });
    }
  });

  // Multer setup for file uploads (memory storage)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    },
  });

  // Upload image to Cloudinary folder
  app.post("/api/admin/images/upload", isAuthenticated, isAdmin, requireCloudinary, upload.single("image"), async (req: any, res) => {
    try {
      const file = req.file;
      const folder = req.body.folder || "";
      if (!file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      res.json({
        id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        folder: result.folder || "",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image", error: error.message });
    }
  });

  // Delete image from Cloudinary
  app.delete("/api/admin/images/:publicId(*)", isAuthenticated, isAdmin, requireCloudinary, async (req, res) => {
    try {
      const publicId = req.params.publicId;
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok") {
        res.json({ message: "Image deleted successfully" });
      } else {
        res.status(404).json({ message: "Image not found or already deleted" });
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image", error: error.message });
    }
  });

  // Move/rename image to a different folder in Cloudinary
  app.post("/api/admin/images/move", isAuthenticated, isAdmin, requireCloudinary, async (req, res) => {
    try {
      const { publicId, targetFolder } = req.body;
      if (!publicId) {
        return res.status(400).json({ message: "publicId is required" });
      }
      if (targetFolder === undefined || targetFolder === null) {
        return res.status(400).json({ message: "targetFolder is required" });
      }

      const filename = publicId.split("/").pop();
      const newPublicId = targetFolder ? `${targetFolder}/${filename}` : filename;

      if (publicId === newPublicId) {
        return res.json({ message: "Image is already in that folder", newPublicId });
      }

      const result = await cloudinary.uploader.rename(publicId, newPublicId, {
        overwrite: true,
      });

      res.json({
        message: "Image moved successfully",
        newPublicId: result.public_id,
        url: result.secure_url,
      });
    } catch (error: any) {
      console.error("Error moving image:", error);
      if (error.http_code === 409) {
        res.status(409).json({ message: "An image with that name already exists in the target folder" });
      } else {
        res.status(500).json({ message: "Failed to move image", error: error.message });
      }
    }
  });

  // Create Cloudinary folder
  app.post("/api/admin/images/folder", isAuthenticated, isAdmin, requireCloudinary, async (req, res) => {
    try {
      const { folder } = req.body;
      if (!folder) {
        return res.status(400).json({ message: "Folder name is required" });
      }
      await cloudinary.api.create_folder(folder);
      res.json({ message: "Folder created", folder });
    } catch (error: any) {
      console.error("Error creating folder:", error);
      res.status(500).json({ message: "Failed to create folder", error: error.message });
    }
  });

  // Event Registration
  app.post("/api/events/:id/register", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { attendeeName, attendeeEmail, numberOfAttendees, requiresPayment } = req.body;

      if (!attendeeName || typeof attendeeName !== "string" || attendeeName.trim().length === 0) {
        return res.status(400).json({ message: "A valid name is required" });
      }
      if (!attendeeEmail || typeof attendeeEmail !== "string" || !attendeeEmail.includes("@")) {
        return res.status(400).json({ message: "A valid email is required" });
      }

      const numAttendees = Math.max(1, Math.floor(Number(numberOfAttendees) || 1));

      const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.maxAttendees) {
        const currentCount = event.currentAttendees || 0;
        if (currentCount + numAttendees > event.maxAttendees) {
          return res.status(400).json({ message: "Not enough spots available for this event" });
        }
      }

      const fee = parseFloat(event.registrationFee || "0");
      const totalAmount = (fee * numAttendees).toFixed(2);

      if (requiresPayment && fee > 0) {
        const amountInCents = Math.round(parseFloat(totalAmount) * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          metadata: {
            eventId: id,
            attendeeName: attendeeName.trim(),
            attendeeEmail: attendeeEmail.trim(),
            numberOfAttendees: numAttendees.toString(),
            type: "event_registration",
          },
        });

        const [registration] = await db.insert(eventRegistrations).values({
          eventId: id,
          attendeeName: attendeeName.trim(),
          attendeeEmail: attendeeEmail.trim(),
          numberOfAttendees: numAttendees,
          totalAmount,
          stripePaymentIntentId: paymentIntent.id,
          status: "pending",
        }).returning();

        return res.json({
          registration,
          clientSecret: paymentIntent.client_secret,
        });
      }

      const [registration] = await db.insert(eventRegistrations).values({
        eventId: id,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
        numberOfAttendees: numAttendees,
        totalAmount: "0",
        status: "confirmed",
      }).returning();

      await db.update(events)
        .set({ currentAttendees: (event.currentAttendees || 0) + numAttendees })
        .where(eq(events.id, id));

      res.status(201).json({ registration });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events/:id/confirm-registration", async (req, res, next) => {
    try {
      const { registrationId, paymentIntentId } = req.body;
      if (!registrationId || !paymentIntentId) {
        return res.status(400).json({ message: "Registration ID and payment intent ID are required" });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment has not been completed" });
      }

      const [reg] = await db.select().from(eventRegistrations)
        .where(eq(eventRegistrations.id, registrationId))
        .limit(1);

      if (!reg) {
        return res.status(404).json({ message: "Registration not found" });
      }

      if (reg.status === "confirmed") {
        return res.json({ message: "Already confirmed", registration: reg });
      }

      await db.update(eventRegistrations)
        .set({ status: "confirmed" })
        .where(eq(eventRegistrations.id, registrationId));

      await db.update(events)
        .set({ currentAttendees: sql`COALESCE(current_attendees, 0) + ${reg.numberOfAttendees || 1}` })
        .where(eq(events.id, reg.eventId));

      res.json({ message: "Registration confirmed" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/event-registrations", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const result = await db.select().from(eventRegistrations).orderBy(desc(eventRegistrations.createdAt));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Site Settings (public read)
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const value = await storage.getSetting(key);
      res.json({ key, value: value ?? "false" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  // Admin Settings CRUD
  app.get("/api/admin/settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings/:key", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      if (typeof value !== "string") {
        return res.status(400).json({ message: "value must be a string" });
      }
      await storage.setSetting(key, value);
      res.json({ key, value });
    } catch (error) {
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Newsletter Subscriptions
  app.post("/api/newsletter/subscribe", async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "A valid email address is required" });
      }

      const existing = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email.toLowerCase())).limit(1);
      if (existing.length > 0) {
        if (!existing[0].isActive) {
          await db.update(newsletterSubscribers).set({ isActive: true }).where(eq(newsletterSubscribers.id, existing[0].id));
        }
        return res.json({ message: "Subscribed successfully" });
      }

      await db.insert(newsletterSubscribers).values({ email: email.toLowerCase() });
      res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/newsletter-subscribers", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const result = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/newsletter-subscribers/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      await db.update(newsletterSubscribers).set({ isActive: false }).where(eq(newsletterSubscribers.id, id));
      res.json({ message: "Subscriber deactivated" });
    } catch (error) {
      next(error);
    }
  });

  // Admin Dashboard Stats
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const [
        [donationsCount],
        [eventsCount],
        [blogPostsCount],
        [volunteersCount],
        [messagesCount],
        [usersCount],
        [completedDonations],
      ] = await Promise.all([
        db.select({ value: count() }).from(donations),
        db.select({ value: count() }).from(events),
        db.select({ value: count() }).from(blogPosts),
        db.select({ value: count() }).from(volunteerSubmissions),
        db.select({ value: count() }).from(contactMessages),
        db.select({ value: count() }).from(users),
        db.select({ value: sum(donations.amount) }).from(donations).where(eq(donations.status, "completed")),
      ]);

      res.json({
        totalDonations: donationsCount.value,
        totalEvents: eventsCount.value,
        totalBlogPosts: blogPostsCount.value,
        totalVolunteers: volunteersCount.value,
        totalMessages: messagesCount.value,
        totalUsers: usersCount.value,
        recentDonationsAmount: completedDonations.value || "0",
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Admin Events CRUD
  app.put("/api/admin/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const body = { ...req.body };
      if (body.date && typeof body.date === "string") body.date = new Date(body.date);
      const validated = insertEventSchema.partial().parse(body);
      const result = await db.update(events).set({ ...validated }).where(eq(events.id, id)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/admin/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(events).where(eq(events.id, id));
      res.json({ message: "Event deleted" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Admin Blog CRUD
  app.put("/api/admin/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const body = { ...req.body };
      if (body.publishedAt && typeof body.publishedAt === "string") body.publishedAt = new Date(body.publishedAt);
      const validated = insertBlogPostSchema.partial().parse(body);
      const result = await db.update(blogPosts).set({ ...validated, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Admin Users
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const result = await db.select().from(users).orderBy(desc(users.createdAt));
      res.json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const validRoles = ["user", "volunteer", "admin", "board_member"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
      }
      const result = await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Admin Status Updates for Submissions
  app.put("/api/admin/volunteer-submissions/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["new", "contacted", "confirmed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      }
      const result = await db.update(volunteerSubmissions).set({ status }).where(eq(volunteerSubmissions.id, id)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Volunteer submission not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating volunteer submission status:", error);
      res.status(500).json({ message: "Failed to update volunteer submission status" });
    }
  });

  app.put("/api/admin/contact-messages/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["new", "read", "responded"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      }
      const result = await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id)).returning();
      if (result.length === 0) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating contact message status:", error);
      res.status(500).json({ message: "Failed to update contact message status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
