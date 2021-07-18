module.exports = (rooms, socket, socketInfo, io) => {
    const fs = require("fs")
    const path = require("path")
    const listenersPath = path.resolve(__dirname)
    fs.readdir(listenersPath, (err, files) => {
        if (err) {
            process.exit(1)
        }
        files.map((fileName) => {
            if (fileName !== "index.js") {
                const listener = require(path.resolve(__dirname, fileName))
                listener(rooms, socket, socketInfo, io);
            }
        })
    })
}