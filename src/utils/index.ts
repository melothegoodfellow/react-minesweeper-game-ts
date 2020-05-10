import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from '../constants';
import { CellValue, CellState, Cell } from '../types';

export const generateCells = (): Cell[][] => {
    const cells: Cell[][] = [];

    const countBombs = (rowIndex: number, colIndex: number): CellValue => {
        const max_rows = MAX_ROWS - 1;
        const max_cols = MAX_COLS - 1;
        const topLeftBomb = (rowIndex > 0 && colIndex > 0 && cells[rowIndex - 1][colIndex - 1].value === 9) ? 1 : 0;
        const topCenterBomb = (rowIndex > 0 && cells[rowIndex - 1][colIndex].value === 9) ? 1 : 0;
        const topRightBomb = (rowIndex > 0 && colIndex < max_cols && cells[rowIndex - 1][colIndex + 1].value === 9) ? 1 : 0;
        const bottomLeftBomb = (rowIndex < max_rows && colIndex > 0 && cells[rowIndex + 1][colIndex - 1].value === 9) ? 1 : 0;
        const bottomCenterBomb = (rowIndex < max_rows && cells[rowIndex + 1][colIndex].value === 9) ? 1 : 0;
        const bottomRightBomb = (rowIndex < max_rows && colIndex < max_cols && cells[rowIndex + 1][colIndex + 1].value === 9) ? 1 : 0;
        const leftBomb = (colIndex > 0 && cells[rowIndex][colIndex - 1].value === 9) ? 1 : 0;
        const rightBomb = (colIndex < max_cols && cells[rowIndex][colIndex + 1].value === 9) ? 1 : 0;
        const count: number =
            topLeftBomb + topCenterBomb + topRightBomb
            + leftBomb + rightBomb
            + bottomLeftBomb + bottomCenterBomb + bottomRightBomb;
        return count;
    }

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open //TODO: change to open
            });
        }
    }

    //randomly added 10 bombs
    let bombCount = 0;
    while (bombCount < NUMBER_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
        const cell = cells[randomRow][randomCol];
        if (cell.value !== CellValue.bomb) {
            cell.value = CellValue.bomb;
            bombCount++;
        }
    }

    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const cell = cells[rowIndex][colIndex];
            if (cell.value !== CellValue.bomb) {
                cell.value = countBombs(rowIndex, colIndex);
            }
        }
    }

    return cells;
}