import express, { Request, Response } from "express";
import { AtpAgent, AtpSessionEvent } from "@atproto/api";

const router = express.Router();

const agent = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (evt: AtpSessionEvent, sess) => {
    if (evt === "create") {
      require("fs").writeFileSync("session.json", JSON.stringify(sess));
    }
  },
});

router.post("/login", async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  try {
    const session = await agent.login({
      identifier,
      password,
    });
    console.log("session", session);
    res.json({ message: "login successfully", headers: session.headers });
  } catch (error) {
    res.status(500).json({ message: "login failed", error });
  }
});

export { router as authRoutes };
