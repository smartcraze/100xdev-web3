const crypto = require("crypto");

function sha256(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

console.log("SHA-256 Hash:", sha256("my_secure_password"));

