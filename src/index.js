import React, {Fragment} from 'react'
import {render} from 'react-dom'
import {injectGlobal} from 'styled-components'

injectGlobal`
    *, *::before, *::after{
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }
    
    :root{
        background: #1b2838;
        font-family: Arial, sans-serif;
        font-size: 15px;
    }

    html, body{
        width: 100%;
    }

    body{
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 3rem 0;
        
        min-height: 100%;
    }
    
    h1, h2{
        color: #ffffff;
        text-align: center;
        margin-top: 1em;
        margin-bottom: 1.5em;
    }
    
    p{
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    
    .text-center{ text-align: center }
`

import Container from './components/Container'
import Button from './components/Button'
import Players, {Player, AppendPlayer} from './components/Players'
import Games, {Game, PreloadGame} from './components/Games'

const API_URL = 'http://localhost:3000/api'

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            players: [
                {name: 'gwellir'},
                {name: 'hwestar'}
            ],
            mutualGames: null,
        }
    }

    resetGames = () => {
        this.setState({mutualGames: null})
    }

    appendPlayer = (e) => {
        e.preventDefault()

        const players = [...this.state.players]

        players.push({name: ''})

        this.setState({players, mutualGames: null})
    }

    removePlayer = (playerIndex, e) => {
        e.preventDefault()

        const players = [...this.state.players]
        players.splice(playerIndex, 1)

        this.setState({players, mutualGames: null})
    }

    playerNameHandle = (playerIndex, e) => {
        const players = [...this.state.players]
        players[playerIndex] = {name: e.target.value}

        this.setState({players, mutualGames: null})
    }

    getPlayerInfo = (playerIndex) => {
        const players = [...this.state.players]
        const player = players[playerIndex]
        if(!player.name) return

        player.loading = true
        this.setState({players})

        fetch(`${API_URL}/getPlayerInfo?player=${player.name}`)
            .then(r => {
                if (r.status >= 200 && r.status < 300) {
                    return r.json()
                } else {
                    return Promise.reject(new Error(r.statusText))
                }
            })
            .then((profileInfo) => {
                const players = [...this.state.players]
                const player = players[playerIndex]

                if(profileInfo) {
                    player.avatar = profileInfo.avatarfull
                    player.steamId = profileInfo.steamid
                    player.loading = false

                    this.setState({players})
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    onSubmit = (e) => {
        e.preventDefault()

        this.setState({mutualGamesLoading: true, message: null})

        const request = `steamIds=${this.state.players.map(p => p.steamId).join(',')}`

        fetch(`${API_URL}/getMutualGames?${request}`)
            .then(r => {
                this.setState({mutualGamesLoading: false})

                if (r.status >= 200 && r.status < 300) {
                    return r.json()
                } else {
                    return Promise.reject(new Error(r.statusText))
                }
            })
            .then(mutualGames => {
                this.setState({mutualGames})
            })
            .catch(e => {
                this.setState({message: 'There is no matched games'})
            })
    }

    render() {
        return (
            <Container>
                {!this.state.mutualGames && (
                    <h1>Hello! Add some players and watch which games you can play together</h1>
                )}

                <form onSubmit={this.onSubmit}>
                    <Players>
                        {this.state.players.map((player, i) => (
                            <Player
                                key={i}
                                player={player}
                                onChange={this.playerNameHandle.bind(this, i)}
                                onBlur={this.getPlayerInfo.bind(this, i)}
                                onRemove={this.removePlayer.bind(this, i)}
                            />
                        ))}
                        <AppendPlayer onClick={this.appendPlayer} />
                    </Players>

                    <p className="text-center">
                        <Button
                            disabled={this.state.players.filter(p => p.steamId).length < 2}
                        >Submit</Button>
                    </p>
                </form>

                {(this.state.mutualGames || this.state.mutualGamesLoading) && (
                    <Fragment>
                        <h2>Here is the games you can play with friends</h2>
                        <Games>
                            {this.state.mutualGames &&
                                this.state.mutualGames.map(game => <Game key={game.appid} game={game} />)
                            }
                            {this.state.mutualGamesLoading &&
                                [...Array(4)].map((k, i) => <PreloadGame key={i} />)
                            }
                        </Games>
                    </Fragment>
                )}

                {this.state.message && (
                    <h2>{this.state.message}</h2>
                )}
            </Container>
        )
    }
}

render(<App />, document.querySelector('#root'))
