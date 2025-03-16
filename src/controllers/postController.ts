import express, { Request, Response } from "express";
import { AtpAgent } from "@atproto/api";
import { RichText } from "@atproto/api";

const router = express.Router();

router.post("/create", async (req: Request, res: Response): Promise<any> => {
  const { text, refreshJwt, did, handle } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Missing authorization token" });
  }

  try {
    const agent = new AtpAgent({
      service: "https://bsky.social",
    });

    const session = await agent.resumeSession({
      accessJwt: token,
      refreshJwt,
      did,
      handle,
      active: true,
    });

    if (!session || !agent.session) {
      return res
        .status(500)
        .json({ message: "Session not initialized or invalid" });
    }

    const rt = new RichText({ text });
    await rt.detectFacets(agent);

    const postObject = {
      text: rt.text,
      createdAt: new Date().toISOString(),
    };

    const result = await agent.app.bsky.feed.post.create(
      { repo: agent.session.did },
      postObject
    );

    res.json({
      message: "Post successful",
      uri: result.uri,
      cid: result.cid,
    });
  } catch (error) {
    res.status(500).json({ message: "Post failed", error });
  }
});

router.get("/timeline", async (req: Request, res: Response): Promise<any> => {
  const { refreshJwt, did, handle } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Missing authorization token" });
  }

  try {
    const agent = new AtpAgent({
      service: "https://bsky.social",
    });

    const session = await agent.resumeSession({
      accessJwt: token,
      refreshJwt,
      did,
      handle,
      active: true,
    });

    if (!session || !agent.session) {
      return res.status(500).json({ message: "Session not initialized" });
    }

    const timeline = await agent.app.bsky.feed.getTimeline({ limit: 10 });
    res.json({ timeline: timeline.data });
  } catch (error) {
    console.error("Timeline error:", error);
    res.status(500).json({ message: "Get timeline failed", error });
  }
});

export { router as postRoutes };
