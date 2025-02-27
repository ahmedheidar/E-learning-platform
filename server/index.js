import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import instructorRoutes from "./routes/instructor.js";
import courseRoutes from "./routes/course.js";
import indvidualRoutes from "./routes/individualTrainee.js";
import administratorRoutes from "./routes/administrator.js";
import Stripe from "stripe";

import corporateRoutes from "./routes/corporateTrainee.js";
import userRoutes from "./routes/userRoutes.js";
import reportedProblems from "./routes/reportedProblems.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/instructor", instructorRoutes);
app.use("/course", courseRoutes);
app.use("/individualTrainee", indvidualRoutes);
app.use("/administrator", administratorRoutes);
app.use("/corporateTrainee", corporateRoutes);
app.use("/users", userRoutes);
app.use("/reportedProblems", reportedProblems);


app.get("/", (req, res) => {
  res.send("Hello to the API");
});

const stripe = new Stripe("sk_test");

const port = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )

  .catch((err) => console.log(err.message));
