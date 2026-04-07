import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import AppDataSource from "./data-source.js";
import authRoutes from "./routes/auth.route.js";
import path from "path";



const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


console.log("process.env.PORT",process.env.PORT)

app.get("/", async (req, res) => {
  // res.send(result.rows);
  res.send("Hello World!");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);


if (process.env.NODE_ENV === "production") {
	const frontendPath = path.join(__dirname, "frontend", "dist");

	app.use(express.static(frontendPath));

app.use((req, res) => {
		res.sendFile(path.join(frontendPath, "index.html"));
	});
}






// START DB + SERVER
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log("Server running:", PORT);
    });
  } catch (err) {
    console.log("DB Error:", err);
  }
};

startServer();