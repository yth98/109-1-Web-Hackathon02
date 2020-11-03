import React from "react"
import "./Grid.css"

let Grid_1x1 = ({value, fixed, row_index, col_index, handle_grid_1x1_click, selectedGrid, conflicted}) => {
    const gridStyle = {
        color: (selectedGrid.row_index === row_index && selectedGrid.col_index === col_index) || conflicted ? "#FFF" : fixed ? "#666" : "#6CC",
        backgroundColor: selectedGrid.row_index === row_index && selectedGrid.col_index === col_index ? "#333" : conflicted ? "#E77" : "#FFF",
        borderTop: (row_index % 3 === 0) ? "1.5px solid transparent" : "1.5px solid #999",
        borderBottom: (row_index % 3 === 2) ? "1.5px solid transparent" : "1.5px solid #999",
        borderLeft: (col_index % 3 === 0) ? "1.5px solid transparent" : "1.5px solid #999",
        borderRight: (col_index % 3 === 2) ? "1.5px solid transparent" : "1.5px solid #999",
    };
    return (
        <div className="grid_1x1" id={`grid-${row_index}*${col_index}`} tabindex="1" style={gridStyle} onClick={() => handle_grid_1x1_click(row_index, col_index)}>
            { value === "0" ? "" : value}
        </div>
    );
};

export default Grid_1x1;