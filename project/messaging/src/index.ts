const app = require("./app");

const PORT = parseInt(process.env.PORT || "3010", 10);
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
    console.log(`Messaging server listening on port ${PORT}`);
});