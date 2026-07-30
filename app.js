const express = require("express");
const app = express();
app.use(express.json());
const route = require("./backend/routes/route");
app.use("/auth",route);
const PORT = 3000;
app.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`);
});