require("dotenv").config();
require("./configs/dbConnect");
const app = require("./app");
const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
