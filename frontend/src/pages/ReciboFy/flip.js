import React from "react";
import styled from "styled-components";
export const Cont = styled.div`
    perspective: 700;
`
export const FlipCard = styled.div`
    transition: all 0.6s ease;
    transform-style: preserve-3d;
    &:hover{
        transform: rotateY(180deg);
    }
    .back{
        transform: rotateY(180deg);
    }
    .front{
        transform: rotateY(0deg);
    }

    .front{
        backface-visibility: hidden;
    }
    .back{
        backface-visibility: hidden;
        position: absolute;
        top: 10%;
        left: 0%;
        transform: translateY(-10%px) translateX(-0%);
        transfor:rotateY(180deg);
        text-align: center;
    }
`