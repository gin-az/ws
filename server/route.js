const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Раз два три");
});

module.exports = router;
