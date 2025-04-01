const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));



app.get("/", (req, res) => {
    res.send("Backend running successfully");
});


app.use('/api', userRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
