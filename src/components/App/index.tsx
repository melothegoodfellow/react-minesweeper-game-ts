import React from "react";

import "./App.scss";
import NumberDisplay from "./NumberDisplay";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={0}></NumberDisplay>
                <div className="Face">
                    &#128513;
               </div>
                <NumberDisplay value={23}></NumberDisplay>
            </div>
            <div className="Body">
                Body
            </div>
        </div>
    );
}

export default App;