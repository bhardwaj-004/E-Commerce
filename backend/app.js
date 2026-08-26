const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors()); // cosrs allows the browser to make requests ebtween different orgins when permitted
app.use(express.json());
const route = require("./routes/route");
app.use("/auth",route);
const PORT = 3000;
app.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`);
});