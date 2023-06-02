const app = require("./app");
const dbConnection = require("./src/configs/db");

const port = process.env.PORT || 3030;

app.listen(port, async (req, res) => {
  await dbConnection();
  console.log(`server running on port ${port}`);
});
