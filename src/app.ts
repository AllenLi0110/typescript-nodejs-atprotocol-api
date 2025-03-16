import express from "express";
import bodyParser from "body-parser";
import { authRoutes } from "./controllers/authController";
import { postRoutes } from "./controllers/postController";

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
