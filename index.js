const express = require("express");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");


dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to MongoDB"))
.catch;((err) => console.log(err));

const storage = multer.diskStorage({ //Zadeklarowanie miejsca w którym mają się zapisywać zdjęcia za pomocą biblioteki mutler
    destination: (req,file,cb) =>{
        cb(null,"images") //Określenie folderu
    },filename:(req,file,cb)=>{
        cb(null,req.body.name); //Określenie nazwy pliku (tutaj zczytuje z body)
    }
});

const upload = multer({ storage: storage }); //Określenie gdzie zapisują się zdjęcia, czyli do wcześniej zadeklarowanego storage
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", ()=>{
    console.log("Backend is running.");
});