import React from 'react';
import './gamePage.scss'
import tic from './img/tic.png'
import puzzle from './img/15puzzle.png'
import snake from './img/snake.png'
import { useNavigate } from "react-router-dom";


const GamePage = () => {
     const navigate = useNavigate();
    return (
        <div className='page'>
            <div className='collum'>
                <div>
                    <img src={tic} alt="tic" />
                    <h1>Tic-Tac-Toe</h1>
                    <button onClick={() => navigate("/tic")}>PLAY</button>
                </div>
                <div >
                <img src={puzzle} alt="puzzle" />
                    <h1>15 Puzzle</h1>
                    <button onClick={() => navigate("/puzzle")}>PLAY</button>
                </div>
                <div>
                <img src={snake} alt="snake" />
                    <h1>Snake</h1>
                    <button onClick={() => navigate("/snake")}>PLAY</button>
                </div>
            </div>
        </div>
    );
};

export default GamePage;