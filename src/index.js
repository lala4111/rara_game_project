const express = require('express');

const app = express();
const questionRouter = require("./routes/questions");
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());
app.use("/api/questions",questionRouter);
app.use((req,res) =>{
  res.status(404).json({msg:"Not Found"});
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});



