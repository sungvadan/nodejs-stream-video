const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util');

const app = new express()



app.get('/', async (req, res, next) => {
    if (
        req.query.video === undefined ||
        req.query.video !== 'video-test.mp4'
    ) {
        next()
    }

    const video = req.query.video
    const range = req.header('Range');
    if (!range) {
        res.type(path.extname(video))
        stream  = fs.createReadStream(video)
        stream.pipe(res)
    } else {
        const parts = range.replace('bytes=', '').split('-')
        const stat =  await util.promisify(fs.stat)(video)
        let start = parseInt(parts[0], 10)
        let end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
        
        res.set('Content-Range', `bytes ${start}-${end}/${stat.size}`) 
        res.set('Accept-Range', `bytes`)
        res.set('Content-Length', end - start + 1)
        res.status(206)
        console.log({start, end})
        stream  = fs.createReadStream(video, {start, end})
        stream.pipe(res)

    }



})

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
  

app.listen(3000)