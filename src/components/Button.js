import React from 'react'
import styled from 'styled-components'

const Button = styled(({children, ...rest}) => (
    <button {...rest}>
        <span>{children}</span>
    </button>
))`
    background: #a4d007;
    background: linear-gradient(to bottom, #a4d007 5%, #536904 95%);
    border-radius: 2px;
    border: none;
    cursor: pointer;
    color: #D2E885;
    display: inline-block;
    outline: none;
    padding: 1px;
    text-decoration: none;
    
    &:hover{
        background: #b6d908;
        background: linear-gradient( to bottom, #b6d908 5%, #80a006 95%)
        text-decoration: none;
        color: #fff;
    }
    
    &:active{
        transform: translate3d(0, 2px, 0);
    }

    &:disabled{
        opacity: .5;
        pointer-events: none;
    }

    > span {
        background: #799905;
        background: linear-gradient( to bottom, #799905 5%, #536904 95%);
        border-radius: 2px;
        padding: 1rem 2rem;
        font-size: 1rem;
        display: block;
    }
`

export default Button
