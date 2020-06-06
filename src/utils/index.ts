import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from '../constants';
import { CellValue, CellState, Cell } from '../types';

const getAdjacentCells = (cells: Cell[][], rowIndex: number, colIndex: number): {
    topLeftCell: Cell | null,
    topCenterCell: Cell | null,
    topRightCell: Cell | null,
    leftCell: Cell | null,
    rightCell: Cell | null,
    bottomLeftCell: Cell | null,
    bottomCenterCell: Cell | null,
    bottomRightCell: Cell | null,
} => {
    const max_rows = MAX_ROWS - 1;
    const max_cols = MAX_COLS - 1;
    const topLeftCell =
        (rowIndex > 0 && colIndex > 0) ?
            cells[rowIndex - 1][colIndex - 1] :
            null;
    const topCenterCell =
        (rowIndex > 0) ?
            cells[rowIndex - 1][colIndex] :
            null;
    const topRightCell =
        (rowIndex > 0 && colIndex < max_cols) ?
            cells[rowIndex - 1][colIndex + 1] :
            null;
    const bottomLeftCell =
        (rowIndex < max_rows && colIndex > 0) ?
            cells[rowIndex + 1][colIndex - 1] :
            null;
    const bottomCenterCell =
        (rowIndex < max_rows) ?
            cells[rowIndex + 1][colIndex] :
            null;
    const bottomRightCell =
        (rowIndex < max_rows && colIndex < max_cols) ?
            cells[rowIndex + 1][colIndex + 1] :
            null;
    const leftCell =
        (colIndex > 0) ?
            cells[rowIndex][colIndex - 1] :
            null;
    const rightCell =
        (colIndex < max_cols) ?
            cells[rowIndex][colIndex + 1] :
            null;
    return {
        topLeftCell,
        topCenterCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCenterCell,
        bottomRightCell,
    };
}

const countBombs = (cells: Cell[][], rowIndex: number, colIndex: number): number => {
    const adjacentCells = getAdjacentCells(cells, rowIndex, colIndex);
    let bombCount = 0;
    for (const [key, adjacentCell] of Object.entries(adjacentCells)) {
        if (adjacentCell && adjacentCell.value === CellValue.bomb) {
            bombCount++;
        }
    }
    return bombCount;
}

export const openBlankCells = (cells: Cell[][], rowIndex: number, colIndex: number) => {
    const cell = cells[rowIndex][colIndex];
    if (cell.state == CellState.visible)
        return;
    cells[rowIndex][colIndex].state = CellState.visible;
    if (colIndex < MAX_COLS - 1 && cell.value === CellValue.none) {
        openBlankCells(cells, rowIndex, colIndex + 1);
    }
    if (colIndex > 0 && cell.value === CellValue.none) {
        openBlankCells(cells, rowIndex, colIndex - 1);
    }
    if (rowIndex < MAX_ROWS - 1 && cell.value === CellValue.none) {
        openBlankCells(cells, rowIndex + 1, colIndex);
    }
    if (rowIndex > 0 && cell.value === CellValue.none) {
        openBlankCells(cells, rowIndex - 1, colIndex);
    }
}

//randomly added 10 bombs
export const placeBombs = (cells: Cell[][], rowIndex: number, colIndex: number) => {
    let bombCount = 0;
    let cell = {
        value: CellValue.none,
        state: CellState.open
    }
    while (bombCount < NUMBER_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
        const position = (randomRow !== rowIndex && randomCol !== colIndex)
                    && (randomRow !== rowIndex - 1 && randomCol !== colIndex - 1)
                    && (randomRow !== rowIndex - 1 && randomCol !== colIndex)
                    && (randomRow !== rowIndex - 1 && randomCol !== colIndex + 1)
                    && (randomRow !== rowIndex && randomCol !== colIndex - 1)
                    && (randomRow !== rowIndex && randomCol !== colIndex + 1)
                    && (randomRow !== rowIndex + 1 && randomCol !== colIndex - 1)
                    && (randomRow !== rowIndex + 1 && randomCol !== colIndex)
                    && (randomRow !== rowIndex + 1 && randomCol !== colIndex + 1)
        if (position) {
            cell = cells[randomRow][randomCol];
            if (cell.value !== CellValue.bomb) {
                cell.value = CellValue.bomb;
                bombCount++;
            }
        }
    }

    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const cell = cells[rowIndex][colIndex];
            if (cell.value !== CellValue.bomb) {
                cell.value = countBombs(cells, rowIndex, colIndex);
            }
        }
    }
}

export const generateCells = (): Cell[][] => {
    const cells: Cell[][] = [];

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open //TODO: change to open for playing game
            });
        }
    }

    return cells;
}