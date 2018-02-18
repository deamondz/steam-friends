import React, {Fragment} from 'react'
import {render} from 'react-dom'

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            players: [
                {id: 0, name: 'gwellir'}
            ],
            mutualGames: null,
        }
    }

    appendPlayer = (e) => {
        e.preventDefault()

        const players = [...this.state.players]

        players.push({
            id: Math.round(Math.random() * 100000),
            name: ''
        })

        this.setState({players})
    }

    removePlayer = (playerId, e) => {
        e.preventDefault()

        const players = [...this.state.players]
        const index = players.findIndex(player => player.id) || null

        if(index === null) return

        players.splice(index, 1)
        this.setState({players})
    }

    playerNameHandle = (playerId, e) => {
        const players = [...this.state.players]
        const player = players.find(p => p.id === playerId)
        player.name = e.target.value

        this.setState({players})
    }

    onSubmit = (e) => {
        e.preventDefault()

        const request = `players=${this.state.players.map(p => p.name).join(',')}`

        fetch(`http://localhost:3000/api/getMutualGames?${request}`, {
            //mode: 'no-cors',
        })
            .then(r => r.json())
            .then((response) => {
                this.setState({mutualGames: response})
            })
    }

    render() {
        return (
            <div>
                <h1>Hello! Add some players and watch which games you can play together</h1>

                <form onSubmit={this.onSubmit}>
                    {this.state.players.map((player) => (
                        <p key={player.id}>
                            <input
                                type="text"
                                onChange={this.playerNameHandle.bind(this, player.id)}
                                value={player.name}
                            />
                            <button onClick={this.removePlayer.bind(this, player.id)}>&times;</button>
                        </p>
                    ))}
                    <p>
                        <button onClick={this.appendPlayer}>Add new player</button>
                    </p>
                    <hr />
                    <p>
                        <button>Submit</button>
                    </p>
                </form>

                <hr />

                {this.state.mutualGames && (
                    <Fragment>
                        <h2>Here is the games you can play with friends</h2>
                        <ul>
                            {this.state.mutualGames.map(game => (
                                <li key={game.appid}>
                                    <a href={`https://steamcommunity.com/app/${game.appid}`}>
                                        <img src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`} alt="" />
                                        <div>{game.name}</div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Fragment>
                )}
            </div>
        )
    }
}

render(<App />, document.querySelector('#root'))
