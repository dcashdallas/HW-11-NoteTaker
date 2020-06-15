const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 2001;


let notesData = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));


app.get("/api/notes", function (err, res) {
    try {
        notesData = fs.readFileSync("Develop/db/db.json", "utf8");
        console.log("hello!");
        notesData = JSON.parse(notesData);

    } catch (err) {
        console.log("\n error (in app.get.catch):");
        console.log(err);
    }
    res.json(notesData);
});

app.post("/api/notes", function (req, res) {
    try {
        notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
        console.log(notesData);

        notesData = JSON.parse(notesData);
        req.body.id = notesData.length;
        notesData.push(req.body); // req.body - user input
        notesData = JSON.stringify(notesData);
        fs.writeFile("./Develop/db/db.json", notesData, "utf8", function (err) {
            if (err) throw err;
        });
        res.json(JSON.parse(notesData));

    } catch (err) {
        throw err;
        console.error(err);
    }
});


app.delete("/api/notes/:id", function (req, res) {
    try {
        notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
        notesData = JSON.parse(notesData);
        notesData = notesData.filter(function (note) {
            return note.id != req.params.id;
        });
        notesData = JSON.stringify(notesData);
        fs.writeFile("./Develop/db/db.json", notesData, "utf8", function (err) {
            if (err) throw err;
        });

        res.send(JSON.parse(notesData));

    } catch (err) {
        throw err;
        console.log(err);
    }
});


