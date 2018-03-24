import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root, channel) {
    ReactDOM.render(<Demo channel={channel} />, root);
}

function Init() {
    var board = []
    for (let ii = 0; ii < 8; ii++) {
        board[ii] = []
        for (let jj = 0; jj < 8; jj++) {
            if (ii+jj % 2 == 0) {
                board[ii][jj] = { color : "black", king : false } 
            } else if (ii < 3) { 
                board[ii][jj] = { color : "black", king : false }
            } else if (ii >= 3 & ii < 5) { 
                board[ii][jj] = { color : "blue", king : false }
            } else {                          
                board[ii][jj] = { color : "Cornsilk", king : false }
            }
        }
    }
    return board
}

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = { board : Init(), selected : false, pos1 : {x : -1, y : -1}};
        console.log(this.state.board)
        this.channel.join()
            .receive("ok", msg => { console.log(msg)})
            .receive("error", resp => { console.log("Unable to join channel", resp) });
        this.channel.on("update", this.move_piece.bind(this))
    }

    handleClick(ii, jj) {
        if (this.state.selected) {
            this.channel.push("push", {board : this.state.board, pos1 : this.state.pos1, pos2: {x : ii, y : jj}})
                .receive("ok", this.move_piece.bind(this));
        } else {
        this.channel.push("ping", {board : this.state.board, pos: {x : ii, y : jj}})
                .receive("ok", this.move_piece.bind(this));
        }   
    }

    move_piece(msg) {
        console.log(msg)
        this.setState(msg)
    }

    Rendercards(ii, jj) {
        let tile = this.state.board[ii][jj]
        let style1 = {
            margin: '0px',
            width: '75px',
            height: '75px',
            backgroundColor: 'BlanchedAlmond',
        };
        let style2 = {
            margin: '0px',
            width: '75px',
            height: '75px',
            backgroundColor: 'BurlyWood',
            position: 'relative',
        };

        if ((ii+jj) % 2 == 0) {
            return (
                <div>
                <div className="yellow-box" style={style1}>
                </div>
                </div>)
        } else {
            if (tile.color == "black" || tile.color == "Cornsilk") {
                return (
                    <div>
                    <div className="yellow-box" style={style2}>
                    <svg height="100" width="100">
                    <circle cx="37.5" cy="37.5" r="30" strokeWidth="3" fill={tile.color} onClick={() => this.handleClick(ii, jj)}/>
                    </svg>
                    </div>
                    </div>)
            } else {
                return (
                    <div>
                    <div className="yellow-box" style={style2} onClick={() => this.handleClick(ii, jj)}>
                    </div>
                    </div>)
            }
        }
    }

    render() {
        return (
            <div>
            <div className="row">
            <div className="col">
            <button type="button" className="btn-danger" onClick={() => this.reset()}>Reset</button>
            </div>
            <div className="Score">Score: {this.state.score}</div>
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(0, 0)}
            {this.Rendercards(0, 1)}
            {this.Rendercards(0, 2)}
            {this.Rendercards(0, 3)}
            {this.Rendercards(0, 4)}
            {this.Rendercards(0, 5)}
            {this.Rendercards(0, 6)}
            {this.Rendercards(0, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(1, 0)}
            {this.Rendercards(1, 1)}
            {this.Rendercards(1, 2)}
            {this.Rendercards(1, 3)}
            {this.Rendercards(1, 4)}
            {this.Rendercards(1, 5)}
            {this.Rendercards(1, 6)}
            {this.Rendercards(1, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(2, 0)}
            {this.Rendercards(2, 1)}
            {this.Rendercards(2, 2)}
            {this.Rendercards(2, 3)}
            {this.Rendercards(2, 4)}
            {this.Rendercards(2, 5)}
            {this.Rendercards(2, 6)}
            {this.Rendercards(2, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(3, 0)}
            {this.Rendercards(3, 1)}
            {this.Rendercards(3, 2)}
            {this.Rendercards(3, 3)}
            {this.Rendercards(3, 4)}
            {this.Rendercards(3, 5)}
            {this.Rendercards(3, 6)}
            {this.Rendercards(3, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(4, 0)}
            {this.Rendercards(4, 1)}
            {this.Rendercards(4, 2)}
            {this.Rendercards(4, 3)}
            {this.Rendercards(4, 4)}
            {this.Rendercards(4, 5)}
            {this.Rendercards(4, 6)}
            {this.Rendercards(4, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(5, 0)}
            {this.Rendercards(5, 1)}
            {this.Rendercards(5, 2)}
            {this.Rendercards(5, 3)}
            {this.Rendercards(5, 4)}
            {this.Rendercards(5, 5)}
            {this.Rendercards(5, 6)}
            {this.Rendercards(5, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(6, 0)}
            {this.Rendercards(6, 1)}
            {this.Rendercards(6, 2)}
            {this.Rendercards(6, 3)}
            {this.Rendercards(6, 4)}
            {this.Rendercards(6, 5)}
            {this.Rendercards(6, 6)}
            {this.Rendercards(6, 7)}
            </div>
            <div className="row justify-content-md-center">
            {this.Rendercards(7, 0)}
            {this.Rendercards(7, 1)}
            {this.Rendercards(7, 2)}
            {this.Rendercards(7, 3)}
            {this.Rendercards(7, 4)}
            {this.Rendercards(7, 5)}
            {this.Rendercards(7, 6)}
            {this.Rendercards(7, 7)}
            </div>
            </div>
        );
    }
}
