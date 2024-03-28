import app from "./app";
import dotenv from "dotenv";
import http from "http";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})