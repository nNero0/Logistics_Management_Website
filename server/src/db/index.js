const express = require('express');
const cors = require('cors')
const db = require("./db")

app = express();
const port = 5000;

app.use(cors());
app.use(express.json())

app.get('/api/taixe', (req,res) => {
    const sql = "SELECT * FROM TAI_XE";
    db.query(sql, (err,data) =>{
        if (err) {
            console.log(err);
            return res.status(500).json({error: "Server error"});
        }
        return res.json(data);
    });

});

app.listen(port, () => {
console.log(`🚀 Backend server đang chạy tại http://localhost:${port}`);

});