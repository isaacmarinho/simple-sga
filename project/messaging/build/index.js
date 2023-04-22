"use strict";
const app = require("./app");
const port = process.env.PORT || 3010;
app.listen(port, () => {
    console.log(`Messaging server listening on port ${port}`);
});
