const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const FILE = "bugs.json";

// read bugs
function readBugs() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE));
}

// write bugs
function writeBugs(bugs) {
    fs.writeFileSync(FILE, JSON.stringify(bugs, null, 2));
}

// get bugs
app.get("/bugs", (req, res) => {
    res.json(readBugs());
});

// add bug
app.post("/bugs", (req, res) => {
    const bugs = readBugs();

    const newBug = {
        id: Date.now(),
        title: req.body.title,
        priority: req.body.priority,
        status: "Open"
    };

    bugs.push(newBug);
    writeBugs(bugs);

    res.json(newBug);
});

// update bug
app.put("/bugs/:id", (req, res) => {
    let bugs = readBugs();

    bugs = bugs.map(bug =>
        bug.id == req.params.id
            ? { ...bug, status: req.body.status }
            : bug
    );

    writeBugs(bugs);
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Server running http://localhost:3000");
});
