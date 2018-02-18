const path = require('path')
const fs = require('fs')
const request = require('request')

const dbPath = path.resolve(__dirname, `games.json`)

request({
    url: 'http://steamspy.com/api.php?request=tag&tag=Multiplayer',
    json: true,
}, function(error, response, body) {
    const games = Object
        .values(body)
        .map(game => ({appId: game.appid, name: game.name}))

    const data = {
        lastUpdate: Date.now(),
        games,
    }

    fs.writeFile(dbPath, JSON.stringify(data), () => {
        console.log('Games successfully created')
    })
})
