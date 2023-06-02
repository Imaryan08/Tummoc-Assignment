const app = require("./app");
const dbConnection = require("./configs/db.js");

const port = process.env.PORT || 3030;

app.listen(port, async (req, res) => {
  await dbConnection();
  console.log(`server running on port ${port}`);
});
