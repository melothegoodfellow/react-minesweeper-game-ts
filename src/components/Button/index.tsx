import React from "react";

import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    red?: boolean;
    onClick(rowIndex: number, colIndex: number): (...args: any[]) => void;
    onContextMenu(rowIndex: number, colIndex: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({ row, col, onClick, onContextMenu, state, value, red }) => {
    const renderContent = (): React.ReactNode => {
        switch (state) {
            case CellState.visible:
                if (value === CellValue.bomb) {
                    return (
                        <span role="img" aria-label="bomb">💣
                        </span>
                    );
                }
                else if (value === CellValue.none) {
                    return;
                }
                else
                    return (
                        <span role="img" aria-label="one">{value}
                        </span>
                    );
            case CellState.flagged:
                return (
                    <span role="img" aria-label="red-flag">🚩
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={
                `Button 
                    ${(state === CellState.visible) ? "visible" : ""} 
                    value-${value}
                    ${(red) ? "red" : ""}
                `
            }
            onClick={onClick(row, col)}
            onContextMenu={onContextMenu(row, col)}>
            {renderContent()}
        </div>
    );
}

export default Button;