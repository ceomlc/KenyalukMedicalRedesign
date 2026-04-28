import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import bcrypt from "bcryptjs";
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();
app.set("trust proxy", 1);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);
  if (existing.length > 0) {
    await db.update(users).set({ role: "admin" }).where(eq(users.email, adminEmail));
    return;
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await db.insert(users).values({
    email: adminEmail,
    password: hashedPassword,
    firstName: "Admin",
    lastName: "",
    role: "admin",
  });
}

// Runs once per serverless container cold start
const ready = (async () => {
  await seedAdmin();
  await registerRoutes(app);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
})();

export default async function handler(req: Request, res: Response) {
  await ready;
  return app(req, res);
}
