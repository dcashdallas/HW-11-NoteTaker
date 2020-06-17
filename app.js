const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.port || 2001;
const mainDir = path.join(__dirname, "/Develop/public");

app.use(express.static('Develop/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
    res.json(path.join(__dirname, "Develop/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "Develop/db/db.json"));
});

app.get("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

app.delete("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })

    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.listen(port, function () {
    console.log(`Now listening to port ${port}`);
})