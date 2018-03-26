import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import socket from "./socket";

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
        this.user = user;
        this.channel = props.channel;
        this.state = { board : Init(), selected : false, pos1 : {x : -1, y : -1}, black : "", Cornsilk : "", turn: "", white_count : 12, black_count : 12};
        console.log(this.state.board)
        this.channel.join()
            .receive("ok", msg => { console.log(msg)})
            .receive("error", resp => { console.log("Unable to join channel", resp) });
        this.channel.on("update", this.move_piece.bind(this))
    }

    handleClick(ii, jj) {
        let color = this.state.turn;
        let player = this.state[color];
        console.log(player, this.user)
        if (player =! user) {
            console.log("this was true")
            return
        }
        if (this.state.selected) {
            this.channel.push("push", {board : this.state.board, pos1 : this.state.pos1, pos2: {x : ii, y : jj}, user : this.user })
                .receive("ok", this.move_piece.bind(this));
        } else {
            this.channel.push("ping", {user : this.user, board : this.state.board, pos: {x : ii, y : jj}})
                .receive("ok", this.move_piece.bind(this));
        }   
    }

    move_piece(msg) {
        console.log(msg)
        this.setState(msg)
    }

    your_color(user) {
        if (this.user == this.state.Cornsilk) {
            return "white"
        } else if (this.user == this.state.black) {
            return "black"
        } else {
            return "you are a spectator"
        }
    }

    Rendersquare(ii, jj) {
        let tile = this.state.board[ii][jj]
        let selected_ii = this.state.pos1.x
        let selected_jj = this.state.pos1.y
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
                <div className="square1" style={style1}>
                </div>
                </div>)
        } else {
            if (tile.color == "black" || tile.color == "Cornsilk") {
                if (selected_ii == ii && selected_jj == jj) {
                    if (tile.king) {
                        return (
                            <div>
                            <div className="square2" style={style2}>
                            <svg width="100" height="100">
                            <circle cx="37.5" cy="37.5" r="30" stroke="yellow" strokeWidth="3" fill={tile.color} onClick={() => this.handleClick(ii, jj)}  />
                            <text x="37.5" y="37.5" text-anchor="middle" fill="Purple" font-size="50px" onClick={() => this.handleClick(ii, jj)} font-family="Arial" dy=".3em">&#9818;</text>
                            </svg>
                            </div>
                            </div>
                        )
                    } else {
                        return (
                            <div>
                            <div className="square2" style={style2}>
                            <svg height="100" width="100">
                            <circle cx="37.5" cy="37.5" r="30" stroke="yellow" strokeWidth="3" fill={tile.color} onClick={() => this.handleClick(ii, jj)}/>
                            </svg>
                            </div>
                            </div>)
                    }
                } else {
                    if (tile.king) {
                        return (
                            <div>
                            <div className="square2" style={style2}>
                            <svg height="100" width="100">
                            <circle cx="37.5" cy="37.5" r="30" strokeWidth="3" fill={tile.color} onClick={() => this.handleClick(ii, jj)}/>
                            <text x="37.5" y="37.5" text-anchor="middle" fill="Purple" font-size="50px" onClick={() => this.handleClick(ii, jj)} font-family="Arial" dy=".3em">&#9818;</text>
                            </svg>
                            </div>
                            </div>)
                    } else {
                        return (
                            <div>
                            <div className="square2" style={style2}>
                            <svg height="100" width="100">
                            <circle cx="37.5" cy="37.5" r="30" strokeWidth="3" fill={tile.color} onClick={() => this.handleClick(ii, jj)}/>
                            </svg>
                            </div>
                            </div>)
                    }
                }
            } else {
                return (
                    <div>
                    <div className="square2" style={style2} onClick={() => this.handleClick(ii, jj)}>
                    </div>
                    </div>)
            }
        }
    }

    reset() {
        this.channel.push("reset")
            .receive("ok", this.move_piece.bind(this))
    }

    withdraw() {
        this.channel.push("withdraw", {user : this.user})
        .receive("ok", this.move_piece.bind(this))
    }

    render() {
        if (this.state.white_count == 0) {
            return ( 
                <div>
                <h1>Black wins</h1>
                <button type="button" className="btn-danger" onClick={() => this.reset()}>Reset</button>
                </div>
            )
        } else if (this.state.black_count == 0) {
            return ( 
                <div>
                <h1>White wins</h1>
                <button type="button" className="btn-danger" onClick={() => this.reset()}>Reset</button>
                </div>
            )
        } else {
            return (
                <div>
                <div className="Color">
                <h2>Your Color: {this.your_color(this.user)}</h2>
                </div>
                <div className="row">
                <div className="col">
                <button type="button" className="btn-danger" onClick={() => this.withdraw()}>Withdraw</button>
                </div>
                <div className="Turn">Turn: {this.state[this.state.turn]}</div>
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(0, 0)}
                {this.Rendersquare(0, 1)}
                {this.Rendersquare(0, 2)}
                {this.Rendersquare(0, 3)}
                {this.Rendersquare(0, 4)}
                {this.Rendersquare(0, 5)}
                {this.Rendersquare(0, 6)}
                {this.Rendersquare(0, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(1, 0)}
                {this.Rendersquare(1, 1)}
                {this.Rendersquare(1, 2)}
                {this.Rendersquare(1, 3)}
                {this.Rendersquare(1, 4)}
                {this.Rendersquare(1, 5)}
                {this.Rendersquare(1, 6)}
                {this.Rendersquare(1, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(2, 0)}
                {this.Rendersquare(2, 1)}
                {this.Rendersquare(2, 2)}
                {this.Rendersquare(2, 3)}
                {this.Rendersquare(2, 4)}
                {this.Rendersquare(2, 5)}
                {this.Rendersquare(2, 6)}
                {this.Rendersquare(2, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(3, 0)}
                {this.Rendersquare(3, 1)}
                {this.Rendersquare(3, 2)}
                {this.Rendersquare(3, 3)}
                {this.Rendersquare(3, 4)}
                {this.Rendersquare(3, 5)}
                {this.Rendersquare(3, 6)}
                {this.Rendersquare(3, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(4, 0)}
                {this.Rendersquare(4, 1)}
                {this.Rendersquare(4, 2)}
                {this.Rendersquare(4, 3)}
                {this.Rendersquare(4, 4)}
                {this.Rendersquare(4, 5)}
                {this.Rendersquare(4, 6)}
                {this.Rendersquare(4, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(5, 0)}
                {this.Rendersquare(5, 1)}
                {this.Rendersquare(5, 2)}
                {this.Rendersquare(5, 3)}
                {this.Rendersquare(5, 4)}
                {this.Rendersquare(5, 5)}
                {this.Rendersquare(5, 6)}
                {this.Rendersquare(5, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(6, 0)}
                {this.Rendersquare(6, 1)}
                {this.Rendersquare(6, 2)}
                {this.Rendersquare(6, 3)}
                {this.Rendersquare(6, 4)}
                {this.Rendersquare(6, 5)}
                {this.Rendersquare(6, 6)}
                {this.Rendersquare(6, 7)}
                </div>
                <div className="row justify-content-md-center">
                {this.Rendersquare(7, 0)}
                {this.Rendersquare(7, 1)}
                {this.Rendersquare(7, 2)}
                {this.Rendersquare(7, 3)}
                {this.Rendersquare(7, 4)}
                {this.Rendersquare(7, 5)}
                {this.Rendersquare(7, 6)}
                {this.Rendersquare(7, 7)}
                </div>
                </div>
            );
        }
    }
}
