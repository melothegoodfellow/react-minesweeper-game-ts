import React, { useState, useEffect } from "react";

import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import Button from "../Button";
import { Smileys, Cell, CellState } from "../../types";
import { NUMBER_OF_BOMBS } from "../../constants";

const App: React.FC = () => {

    const [cells, setCells] = useState<Cell[][]>(generateCells);
    const [smiley, setSmiley] = useState<Smileys>(Smileys.grin);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCount, setBombCount] = useState<number>(NUMBER_OF_BOMBS);

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

    const cellClick = (rowIndex: number, colIndex: number) => (): void => {
        console.log(rowIndex, colIndex);
        if (!live) {
            setLive(true);
        }
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

    const faceClick = () => {
        if (live) {
            setLive(false);
            setTime(0);
            setCells(generateCells());
            setBombCount(0);
        }
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
                >
                </Button>;
            });
        });
    }

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={bombCount}></NumberDisplay>
                <div className="Face"
                    onClick={faceClick}>
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