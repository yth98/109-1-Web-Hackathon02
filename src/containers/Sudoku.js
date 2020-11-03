/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Fireworks } from 'fireworks/lib/react'

import "./Sudoku.css"
import Header from '../components/Header';
import Grid_9x9 from '../components/Grid_9x9';
import ScreenInputKeyBoard from '../components/ScreenInputKeyBoard'
import { problemList } from "../problems"

class Sudoku extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, // Return loading effect if this is true.
            problem: null, // Stores problem data. See "../problems/" for more information.This is the origin problem and should not be modified. This is used to distinguish the fixed numbers from the editable values
            gridValues: null,  // A 2D array storing the current values on the gameboard. You should update this when updating the game board values.
            selectedGrid: { row_index: -1, col_index: -1 }, // This objecct store the current selected grid position. Update this when a new grid is selected.
            gameBoardBorderStyle: "8px solid #000", // This stores the gameBoarderStyle and is passed to the gameboard div. Update this to have a error effect (Bonus #2).
            completeFlag: false, // Set this flag to true when you wnat to set off the firework effect.
            conflicts: [{ row_index: -1, col_index: -1 }] // The array stores all the conflicts positions triggered at this moment. Update the array whenever you needed.
        }
    }

    checkConflicts = (num) => {
        if (num === 0) {
            this.setState({conflicts: []});
            return false;
        }
        let conflicts = [];
        let row = [0,1,2,3,4,5,6,7,8].map((_,i) => {
            if (this.state.gridValues[this.state.selectedGrid.row_index][i] === num.toString() && i !== this.state.selectedGrid.col_index) {
                conflicts.push({row_index: this.state.selectedGrid.row_index, col_index: i,});
                return _;
            } else
                return undefined;
        });
        let col = [0,1,2,3,4,5,6,7,8].map((_,i) => {
            if (this.state.gridValues[i][this.state.selectedGrid.col_index] === num.toString() && i !== this.state.selectedGrid.row_index) {
                conflicts.push({row_index: i, col_index: this.state.selectedGrid.col_index,});
                return _;
            } else
                return undefined;
        });
        let nine = [0,1,2,3,4,5,6,7,8].map((_,i) => {
            let ir = Math.floor(i/3), ic = i%3;
            let br = Math.floor(this.state.selectedGrid.row_index/3), bc = Math.floor(this.state.selectedGrid.col_index/3);
            let xr = this.state.selectedGrid.row_index%3, xc = this.state.selectedGrid.col_index%3;
            // console.log(ir, ic, br, bc, xr, xc);
            if (this.state.gridValues[br*3+ir][bc*3+ic] === num.toString() && (ir !== xr || ic !== xc)) {
                conflicts.push({row_index: br*3+ir, col_index: bc*3+ic,});
                return _;
            } else
                return undefined;
        });
        // console.log(row, this.state.selectedGrid.col_index);
        // console.log(col, this.state.selectedGrid.row_index);
        // console.log(nine);
        this.setState({conflicts: conflicts});
        return (row.every(v => v === undefined) === false || col.every(v => v === undefined) === false || nine.every(v => v === undefined) === false);
    }

    handle_grid_1x1_click = (row_index, col_index) => {
        this.setState({selectedGrid: { row_index: row_index, col_index: col_index }});
    }

    handleKeyDownEvent = (event) => {
        if (this.state.gridValues !== null && this.state.selectedGrid.row_index !== -1 && this.state.selectedGrid.col_index !== -1 && ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
            if (this.state.problem.content[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] === "0") {
                if (this.checkConflicts(event.keyCode - 48) === false)
                    this.setState(state => ({gridValues: [
                        ...state.gridValues.slice(0,state.selectedGrid.row_index),
                        [
                            ...state.gridValues[state.selectedGrid.row_index].slice(0,state.selectedGrid.col_index),
                            (event.keyCode - 48).toString(),
                            ...state.gridValues[state.selectedGrid.row_index].slice(state.selectedGrid.col_index+1),
                        ],
                        ...state.gridValues.slice(state.selectedGrid.row_index+1),
                    ]}));
                else {
                    this.setState({ gameBoardBorderStyle: "8px solid #E77" });
                    setTimeout(() => { this.setState({ gameBordBoarderStyle: "8px solid #333" }); }, 1);
                }
            }
        }
    }

    handleScreenKeyboardInput = (num) => {
        this.handleKeyDownEvent({keyCode: num+48});
    }

    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDownEvent);
    }

    loadProblem = async (name) => {
        this.setState({
            loading: true,
            problem: null,
            gridValues: null,
            selectedGrid: { row_index: -1, col_index: -1 }
        });

        const problem = await require(`../problems/${name}`)
        if (problem.content !== undefined) {
            let gridValues = [];
            for (let i = 0; i < problem.content.length; i++)
                gridValues[i] = problem.content[i].slice();
            this.setState({ problem: problem, gridValues: gridValues, loading: false });
        }
    }

    extractArray(array, col_index, row_index) {
        let rt = []
        for (let i = row_index; i < row_index + 3; i++) {
            for (let j = col_index; j < col_index + 3; j++) {
                rt.push(array[i][j])
            }
        }
        return rt;
    }

    render() {
        const fxProps = {
            count: 3,
            interval: 700,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            colors: ['#cc3333', '#81C784'],
            calc: (props, i) => ({
                ...props,
                x: (i + 1) * (window.innerWidth / 3) * Math.random(),
                y: window.innerHeight * Math.random()
            })
        }
        return (
            <>
                <Header problemList={problemList} loadProblem={this.loadProblem} gridValues={this.state.gridValues} problem={this.state.problem} />
                {this.state.loading ? (<ReactLoading type={"bars"} color={"#777"} height={"40vh"} width={"40vh"} />) : (
                    <div id="game-board" className="gameBoard" style={{ border: this.state.gameBoardBorderStyle }}>
                        <div className="row">
                            <Grid_9x9 row_offset={0} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={3} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={6} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                    </div>
                )}
                {this.state.completeFlag ? (<Fireworks {...fxProps} />) : null}
                {this.state.loading ? null : (<ScreenInputKeyBoard handleScreenKeyboardInput={this.handleScreenKeyboardInput} />)}
            </>
        );
    }
}

export default Sudoku;