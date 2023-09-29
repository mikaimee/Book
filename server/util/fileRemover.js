const fs = require('fs')
const path = require('path')

const fileRemover = (filename) => {
    fs.unlink(path.join(__dirname, '../uploads',filename), function (err) {
        if (err && err.code === "ENOENT") {
            console.log(`File ${filename} doesn't exist, cannot remove.`)
        }
        else if (err) {
            console.log(err.message)
            console.log(`File ${filename} doesn't exist, won't remove it.`)
        }
        else {
            console.log(`removed ${filename}`)
        }
    })
}

module.exports = {fileRemover}