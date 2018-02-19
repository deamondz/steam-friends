import React from 'react'
import styled, {css, keyframes} from 'styled-components'

const Loading = keyframes`
    0%, 100% { opacity: .5; }
    50% { opacity: .75; }
`

const Games = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -.5rem;
`

const Poster = styled.div`
    background-color: #eeeeee;
    background-size: cover;
    background-position: center;

    height: 70px;
    width: 100%;
    
    ${p => p.src && css`
        background-image: url('${p => p.src}');
    `}
`

const Title = styled.div`
    background: #223b4f;
    padding: 1rem;

    width: 100%;
    
    transition: all .3s ease;
`

const Wrapper = styled.a`
    display: block;
    color: #ffffff;
    overflow: hidden;
    text-decoration: none;
    margin: .5rem;
    position: relative;

    flex: 0 0 calc(25% - 1rem);

    transition: all .1s ease;
    
    &:hover{
        box-shadow: 0 0 0 1px #66c0f4;
    }
`

export function Game({game}) {
    return (
        <Wrapper href={`https://steamcommunity.com/app/${game.appid}`}>
            <Poster src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`} />
            <Title>{game.name}</Title>
        </Wrapper>
    )
}

export const PreloadGame = Wrapper.withComponent('div').extend`
    background: #223b4f;
    animation: infinite 1s ${Loading};
    height: 100px;
`

export default Games
