const express = require('express')
const request = require('request')

const server = express()
const gamesDb = require('./games.json')

const allowedOrigins = [/localhost/]
const STEAM_KEY = '7D5F2FA02FF09ACA687DE979BE355B30'

server.use(express.static('public'))

server.use(function (req, res, next) {
    const origin = req.headers.origin
    const isAllowed = allowedOrigins
        .reduce((p, c) => (new RegExp(c)).test(origin) || p, false)

    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

function getSteamIdByName(name, callback) {
    request({
        url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_KEY}&vanityurl=${name}`,
        json: true,
    }, function (error, response, body) {
        callback(body.response.steamid)
    })
}

function getOwnedMPGames(steamId, callback) {
    const params = {
        include_appinfo: 1,
        include_played_free_games: 1,
        steamid: steamId,
        appids_filter: gamesDb.games.map(g => g.appId),
    }

    request({
        url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&format=json&input_json=${JSON.stringify(params)}`,
        json: true,
    }, function (error, response, body) {
        callback(body.response.games || [])
    })
}

function filterMutualGames(players) {
    const gamesByPlayer = Object
        .values(players)
        .sort((a, b) => b.length - a.length) // сортирует по кол-ву игр на убыль

    let mutualGames = gamesByPlayer[0] // выбирает самый большой массив игр

    for (let i = 1; i < gamesByPlayer.length; i++) { // Проходит по массиву с играми юзеров и оставляет только общие
        const appIds = gamesByPlayer[i].map(g => g.appid)

        mutualGames = mutualGames.filter(({appid}) => appIds.indexOf(appid) >= 0)
    }

    return mutualGames
}

server.get('/api/getMutualGames', function (req, res) {
    const players = req.query.players.split(',')
    const responses = {}
    let responseCount = 0

    players.forEach(player => {
        getSteamIdByName(player, (steamId) => {
            getOwnedMPGames(steamId, (games) => {
                responseCount++
                responses[player] = games

                if (responseCount === players.length) {
                    const mutualGames = filterMutualGames(responses)

                    res.status(200).json(mutualGames)
                }
            })
        })
    })
})

server.listen(3000)
