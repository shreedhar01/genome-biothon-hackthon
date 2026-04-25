import app from "./app.js";
import { config } from "./config/index.js";

const port = config.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
