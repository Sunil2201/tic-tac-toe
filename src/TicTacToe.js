import React, { useState, useEffect, useCallback } from "react";
import {AppBar,Typography,Grow,Grid,Select,MenuItem, FormControl, Button} from '@material-ui/core';
import styled from "styled-components";
import {
  PLAYER_X,
  PLAYER_O,
  SQUARE_DIMS,
  DRAW,
  GAME_STATES,
  DIMS,
  GAME_MODES
} from "./constants";
import Board from "./Board";
import { getRandomInt, switchPlayer } from "./utils";
import { minimax } from "./minimax";
import { ResultModal } from "./ResultModal";
import { border } from "./styles";

const arr = new Array(DIMS ** 2).fill(null);
const board = new Board();

const TicTacToe = ({ squares = arr }) => {
  const [players, setPlayers] = useState({ human: PLAYER_X, computer: PLAYER_O });
  const [gameState, setGameState] = useState(GAME_STATES.notStarted);
  const [grid, setGrid] = useState(squares);
  const [winner, setWinner] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState(GAME_MODES.Easy);

  /**
   * On every move, check if there is a winner. If yes, set game state to over and open result modal
   */
  useEffect(() => {
    const winner = board.getWinner(grid);
    const declareWinner = winner => {
      let winnerStr;
      switch (winner) {
        case PLAYER_X:
          winnerStr = "Player X wins!";
          break;
        case PLAYER_O:
          winnerStr = "Player O wins!";
          break;
        case DRAW:
        default:
          winnerStr = "It's a draw";
      }
      setGameState(GAME_STATES.over);
      setWinner(winnerStr);
      // Slight delay for the modal so there is some time to see the last move
      setTimeout(() => setModalOpen(true), 300);
    };

    if (winner !== null && gameState !== GAME_STATES.over) {
      declareWinner(winner);
    }
  }, [gameState, grid, nextMove]);

  /**
   * Set the grid square with respective player that made the move. Only make a move when the game is in progress.
   * useCallback is necessary to prevent unnecessary recreation of the function, unless gameState changes, since it is
   * being tracked in useEffect
   * @type {Function}
   */
  const move = useCallback(
    (index, player) => {
      if (player && gameState === GAME_STATES.inProgress) {
        setGrid(grid => {
          const gridCopy = grid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameState]
  );

  /**
   * Make computer move. If it's the first move (board is empty), make move at any random cell to skip
   * unnecessary minimax calculations
   * @type {Function}
   */
  const computerMove = useCallback(() => {
    // Important to pass a copy of the grid here
    const board = new Board(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);
    let index;
    switch (mode) {
      case GAME_MODES.Easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
      case GAME_MODES.Medium:
        // Medium level is basically ~half of the moves are minimax and the other ~half random
        const smartMove = !board.isEmpty(grid) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.computer)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;
      case GAME_MODES.Difficult:
      default:
        index = board.isEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(board, players.computer)[1];
    }
    if (!grid[index]) {
      move(index, players.computer);
      setNextMove(players.human);
    }
  }, [move, grid, players, mode]);

  /**
   * Make computer move when it's computer's turn
   */
  useEffect(() => {
    let timeout;
    if (
      nextMove !== null &&
      nextMove === players.computer &&
      gameState !== GAME_STATES.over
    ) {
      // Delay computer moves to make them more natural
      timeout = setTimeout(() => {
        computerMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, computerMove, players.computer, gameState]);

  const humanMove = index => {
    if (!grid[index] && nextMove === players.human) {
      move(index, players.human);
      setNextMove(players.computer);
    }
  };

  const choosePlayer = option => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameState(GAME_STATES.inProgress);
    setNextMove(PLAYER_X);
  };

  const startNewGame = () => {
    setGameState(GAME_STATES.notStarted);
    setGrid(arr);
    setModalOpen(false);
  };

  // const changeMode = e => {
  //   setMode(e.target.value);
  // };

  const levelChange = (value) => {
    setMode(value);
    console.log(value);
  };

  return gameState === GAME_STATES.notStarted ? (
    
    <Container maxWidth = "lg" className="mainContainer">
      <Typography variant="h3" className="heading">T<span className="redLetter">I</span>C</Typography>
      <Typography variant="h3" className="heading"><span className="redLetter">T</span>A<span className="redLetter">C</span></Typography>
      <Typography variant="h3" className="heading">T<span className="redLetter">O</span>E</Typography>
      <Grid item container direction="column" alignItems="center" className="difficulty">
        <Typography variant="h3" className="headingChild1">Select Difficulty</Typography>
        <div className="line"></div>
        <div>

        <div className="easy">
          <div className="img1"></div>
          <button
              className="levelEasy"
              onClick={() => {
                levelChange(GAME_MODES.Easy);
              }}
            >
              Easy Bot
          </button>
        </div>
        <div className="medium">
        <div className="img2"></div>
            <button
              className="levelMedium"
              onClick={() => {
                levelChange(GAME_MODES.Medium);
              }}
            >
              Medium Bot
            </button>
        </div> 
        <div className="difficult">
          
          <div className="img3"></div>
          <button
              className="levelDifficult"
              onClick={() => {
                levelChange(GAME_MODES.Difficult);
              }}
            >
              Difficult Bot
          </button>
        </div>

        </div>
        {/* <FormControl sx={{ m: 1, minWidth: 80 }}>
           
            <Select 
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            onChange={changeMode} value={mode}
            >

              {Object.keys(GAME_MODES).map(key => {
              const gameMode = GAME_MODES[key];
              return (
                <MenuItem key={gameMode} value={gameMode}>{key}</MenuItem>
              );
            })}
          </Select>
          </FormControl> */}
      </Grid>
        
      
      <Grid item container direction="column" alignItems="center">
        <Typography variant="h3" className="heading2">Choose Player</Typography>
        <div className="line1"></div>
        <div className="buttons">
          <Button onClick={() => choosePlayer(PLAYER_X)} variant="contained" color="secondary" size="medium" className="btn"><span className="x">X</span></Button>
          <Typography variant="p">or</Typography>
          <Button variant="contained" color="secondary" size="medium" onClick={() => choosePlayer(PLAYER_O)} className="btn"><span className="o">O</span></Button>
        </div>
      </Grid>

    </Container>
  ) : (
    <Container dims={DIMS} className="game">
      {grid.map((value, index) => {
        const isActive = value !== null;

        return (
          
          <Square
            data-testid={`square_${index}`}
            key={index}
            onClick={() => humanMove(index)}
          >
            {isActive && <Marker className="inputValue">{value === PLAYER_X ? <span className="x">X</span> : <span className="o">O</span>}</Marker>}
          </Square>
        );
      })}
      <Strikethrough
        styles={
          gameState === GAME_STATES.over && board.getStrikethroughStyles()
        }
      />
      <ResultModal
        isOpen={modalOpen}
        winner={winner}
        close={() => setModalOpen(false)}
        startNewGame={startNewGame}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  background-color: #332167;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};
  &:hover {
    cursor: pointer;
  }
  border-radius: 16px;
  margin: 6px 6px;
`;

Square.displayName = "Square";

const Marker = styled.p`
  font-size: 68px;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Screen = styled.div``;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const ChooseText = styled.p``;

const Strikethrough = styled.div`
  position: absolute;
  ${({ styles }) => styles}
  background-color: white;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

export default TicTacToe;