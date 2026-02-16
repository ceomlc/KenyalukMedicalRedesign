import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  users, 
  sessions,
  events, 
  blogPosts, 
  donations, 
  volunteerSubmissions, 
  contactMessages,
  insertEventSchema,
  insertBlogPostSchema,
  insertDonationSchema,
  insertVolunteerSubmissionSchema,
  insertContactMessageSchema
} from "@shared/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
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
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
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

  app.post("/api/events", async (req, res, next) => {
    try {
      const validated = insertEventSchema.parse(req.body);
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

  app.post("/api/blog", async (req, res, next) => {
    try {
      const validated = insertBlogPostSchema.parse(req.body);
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
        
        // Record the donation in the database
        await db.insert(donations).values({
          amount: (paymentIntent.amount / 100).toString(),
          donorName: paymentIntent.metadata.donorName || 'Anonymous',
          donorEmail: paymentIntent.metadata.donorEmail,
          isRecurring: paymentIntent.metadata.isRecurring === 'true',
          status: 'completed',
          stripePaymentIntentId: paymentIntent.id,
        });
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

  // Admin middleware - checks if the user is admin or board_member
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await storage.getUser(userId);
      if (!user || (user.role !== "admin" && user.role !== "board_member")) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

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

  const httpServer = createServer(app);

  return httpServer;
}
