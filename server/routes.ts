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
import { eq, and, desc } from "drizzle-orm";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY must be set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

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
        .where(eq(events.date, now)) // This is a placeholder - need proper date comparison
        .orderBy(desc(events.date))
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

  const httpServer = createServer(app);

  return httpServer;
}
