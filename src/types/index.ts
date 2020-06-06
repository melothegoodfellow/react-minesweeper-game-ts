export enum CellValue {
    none,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb,
}

export enum CellState {
    open,
    visible,
    flagged
}

export enum Smileys {
    grin = '😃',
    shock = '😯',
    lost = '😞',
    won = '😎'
}

export type Cell = {
    value: CellValue,
    state: CellState,
    red?: boolean
}

export type Smiley = {

}
