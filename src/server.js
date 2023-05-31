const app = require("./app");
const dbConnection = require("./configs/db.js");

app.listen(8080, async (req, res) => {
  await dbConnection();
  console.log(`server running on port 8080`);
});
