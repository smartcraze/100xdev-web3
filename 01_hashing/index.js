const crypto = require("crypto");
const ether = require("ether");

function sha256(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

// Example usage
function authenticateUser(inputPassword, storedHash) {
    const inputHash = sha256(inputPassword);
    return inputHash === storedHash;
}

const storedHash = sha256("my_secure_password");
console.log("SHA-256 Hash:", storedHash);


// keccake algorithm


function keccak256(text) {
    return ether.keccak256(text);
}
