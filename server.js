const express = require("express");
const PORT = 2206;
const app = express();
require("./config/db");
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Server Ready!!!");
});

app.use("/api", require("./router/userRouter"));
app.use("/api", require("./other/userUpload"));
app.use("/api", require("./other/uploadContent"));

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);
});
