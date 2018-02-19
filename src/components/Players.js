import React from 'react'
import styled, {css, keyframes} from 'styled-components'

const Players = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 -1rem;
`

const Loading = keyframes`
    0%, 100% { opacity: .75; }
    50% { opacity: 1; }
`

const Avatar = styled.div`
    background-color: #eee;
    background-size: cover;
    background-position: center;

    border-radius: 100%;
    margin: 0 auto 1rem;

    height: 80px;
    width: 80px;
    
    ${p => p.src && css`
        background-image: url('${p => p.src}');
    `}
`

const Input = styled.input`
    background: #0d131b;
    border: 1px solid;
    border-radius: 3px;
    color: #ffffff;
    text-align: center;
    
    font-size: 1rem;
    line-height: 32px;
    width: 100%;
`

const FakeInput = Input.withComponent('div')

const Wrapper = styled.div`
    background: #0d131b;
    padding: 1rem;
    margin: 3rem .5rem 1rem;
    
    flex: 0 0 calc(25% - 1rem);
    
    transition: all .3s ease;
    
    &:hover{
        box-shadow: inset 0 0 0 1px #66c0f4;
    }
    
    ${Avatar}{
        box-shadow: 0 0 0 .25rem #1b2838;
        cursor: pointer;
        margin-top: -3rem;
        position: relative;

        &::before, &::after{
            background: #000;
            display: block;
            content: '';

            transform-origin: center;

            position: absolute;
            left: 50%;
            top: 50%;
            
            height: 2px;
            width: 40px;
            
            transition: all .3s ease;

            opacity: 0;
        }

        &:hover{
            &::before, &::after{
                opacity: 1;
            }
        }

        &::before{ transform: translate3d(-50%, -50%, 0) rotateZ(-45deg); }
        &::after{ transform: translate3d(-50%, -50%, 0) rotateZ(45deg); }
    }
    
    ${p => p.loading && css`
        animation: infinite 1s ${Loading};
    `}
`

export const AppendPlayer = styled(({onClick, ...rest}) => (
    <Wrapper onClick={onClick} {...rest}>
        <Avatar />
        <FakeInput>Добавить игрока</FakeInput>
    </Wrapper>
))`
    cursor: pointer;
    
    &:hover{
        ${Avatar}{
            &::before, &::after{
                opacity: 1;
            }
        }
    }

    ${Avatar}{
        &::before{ transform: translate3d(-50%, -50%, 0) rotateZ(0deg); }
        &::after{ transform: translate3d(-50%, -50%, 0) rotateZ(90deg); }
    }
`

export function Player({player: {avatar, name, loading}, onChange, onBlur, onRemove}) {
    return (
        <Wrapper loading={loading}>
            <Avatar src={avatar} onClick={onRemove} />
            <Input type="text" value={name} onChange={onChange} onBlur={onBlur} />
        </Wrapper>
    )
}

export default Players
