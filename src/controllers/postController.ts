import express, { Request, Response } from "express";
import { AtpAgent } from "@atproto/api";
import { RichText } from "@atproto/api";

const router = express.Router();

const agent = new AtpAgent({
  service: "https://bsky.social",
  persistSession: (evt, sess) => {
    if (evt === "create") {
      require("fs").writeFileSync("session.json", JSON.stringify(sess));
    }
  },
});

router.post("/create", async (req: Request, res: Response) => {
  const { text } = req.body;
  try {
    const rt = new RichText({ text });
    await rt.detectFacets(agent);

    const params = {
      repo: "your_repo_identifier",
    };

    const record = {
      $type: "app.bsky.feed.post",
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
    };

    await agent.app.bsky.feed.post.create(params, record);
    res.json({ message: "post successfully", record });
  } catch (error) {
    res.status(500).json({ message: "post failed", error });
  }
});

router.get("/timeline", async (req: Request, res: Response) => {
  try {
    const timeline = await agent.getTimeline({ limit: 10 });
    res.json({ timeline });
  } catch (error) {
    res.status(500).json({ message: "get timeline failed", error });
  }
});

export { router as postRoutes };
