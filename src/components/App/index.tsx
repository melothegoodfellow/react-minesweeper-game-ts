import React, { useState, useEffect } from "react";

import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells, placeBombs, openBlankCells } from "../../utils";
import Button from "../Button";
import { Smileys, Cell, CellState, CellValue } from "../../types";
import { NUMBER_OF_BOMBS, MAX_COLS, MAX_ROWS } from "../../constants";

const App: React.FC = () => {

    const [cells, setCells] = useState<Cell[][]>(generateCells);
    const [smiley, setSmiley] = useState<Smileys>(Smileys.grin);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCount, setBombCount] = useState<number>(NUMBER_OF_BOMBS);
    const [hasLost, setHasLost] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);

    useEffect(() => {
        const mouseUpEvent = () => {
            setSmiley(Smileys.grin);
        }

        const mouseDownEvent = () => {
            setSmiley(Smileys.shock);
        }

        window.addEventListener("mousedown", mouseDownEvent);
        window.addEventListener("mouseup", mouseUpEvent);

        return () => {
            window.removeEventListener("mousedown", mouseDownEvent);
            window.removeEventListener("mouseup", mouseUpEvent);
        }
    });

    useEffect(() => {
        if (live) {
            const timer = setInterval(() => {
                if (time === 999)
                    return;
                setTime(time + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }

    }, [live, time]);

    useEffect(() => {
        if (hasLost) {
            setLive(false);
            setSmiley(Smileys.lost);
        }
    }, [hasLost]);

    useEffect(() => {
        if (hasWon) {
            setLive(false);
            setSmiley(Smileys.won);
        }
    }, [hasWon]);

    const cellClick = (rowIndex: number, colIndex: number) => (): void => {
        const cell = cells[rowIndex][colIndex];
        if (!live) {
            //TODO: not click on bomb
            setLive(true);
            placeBombs(cells, rowIndex, colIndex);
            openBlankCells(cells, rowIndex, colIndex);
        }
        if ([CellState.flagged, CellState.visible].includes(cell.state))
            return;

        switch (cell.value) {
            case CellValue.bomb:
                setHasLost(true);
                //Open bombs
                const newCells = openAllBombs();
                //make cell red
                newCells[rowIndex][colIndex].red = true;
                setCells(newCells);
                return;
            case CellValue.none:
                openBlankCells(cells, rowIndex, colIndex);
                cells[rowIndex][colIndex].state = CellState.visible;
                //TODO: Dont;
                return;
            default:
                cells[rowIndex][colIndex].state = CellState.visible;
                // setCells(cells);
        }
        let gameEnd = true;
        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLS; col++) {
                if (cells[row][col].value !== CellValue.bomb
                    && cells[row][col].state === CellState.open) {
                    gameEnd = false;
                    break;
                }
            }
        }
        if(gameEnd)
            setHasWon(true);
    }

    const openAllBombs = (): Cell[][] => {
        const newCells = cells.slice();
        return newCells.map((row) => {
            return row.map((cell) => {
                if (cell.value === CellValue.bomb) {
                    return {
                        value: cell.value,
                        state: CellState.visible
                    };
                }
                return cell;
            });
        });
    }

    const cellContext = (rowIndex: number, colIndex: number) => (e: React.MouseEvent<HTMLBodyElement, MouseEvent>): void => {
        e.preventDefault();
        if (!live)
            return;
        const cellsCopy = cells.slice();
        const cell = cells[rowIndex][colIndex];
        switch (cell.state) {
            case CellState.visible:
                return;
            case CellState.open:
                cellsCopy[rowIndex][colIndex].state = CellState.flagged;
                setCells(cellsCopy);
                setBombCount(bombCount - 1);
                break;
            case CellState.flagged:
                cellsCopy[rowIndex][colIndex].state = CellState.open;
                setCells(cellsCopy);
                setBombCount(bombCount + 1);
        }
    }

    const smileyClick = () => {
        setLive(false);
        setTime(0);
        setCells(generateCells());
        setBombCount(NUMBER_OF_BOMBS);
        setHasLost(false);
        setHasWon(false);
    }

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                return <Button
                    row={rowIndex}
                    col={cellIndex}
                    state={cell.state}
                    value={cell.value}
                    key={`${rowIndex}-${cellIndex}`}
                    onClick={cellClick}
                    onContextMenu={cellContext}
                    red={cell.red}
                >
                </Button>;
            });
        });
    }

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={bombCount}></NumberDisplay>
                <div className="Smiley"
                    onClick={smileyClick}>
                    <span role="img" aria-label="grin">{smiley}</span>
                </div>
                <NumberDisplay value={time}></NumberDisplay>
            </div>
            <div className="Body">
                {renderCells()}
            </div>
        </div>
    );
}

export default App;