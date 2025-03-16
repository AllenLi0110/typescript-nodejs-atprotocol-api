import express, { Request, Response } from "express";
import { AtpAgent } from "@atproto/api";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ message: "Identifier and password are required" });
    return;
  }

  try {
    const agent = new AtpAgent({
      service: "https://bsky.social",
    });

    await agent.login({ identifier, password });

    if (!agent.session) {
      throw new Error("Login successful but session not created");
    }

    res.json({
      message: "Login successful",
      accessJwt: agent.session.accessJwt,
      refreshJwt: agent.session.refreshJwt,
      did: agent.session.did,
      handle: agent.session.handle,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: "Login failed", error });
  }
});

export { router as authRoutes };
