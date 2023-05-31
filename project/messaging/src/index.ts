const app = require("./app");

const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3010", 10);

app.listen(PORT, HOST, () => {
    console.log(`Messaging server listening on port ${PORT}`);
});