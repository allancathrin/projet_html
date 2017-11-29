function HumanVsComputer()
{
    var boardElement = document.getElementById('board');
    var boardElement2 = document.getElementById('board2');
    boardElement.display = 'initial';
    boardElement2.display = 'none';

    var board,
        game = new Chess();

// do not pick up pieces if the game is over
// only pick up pieces for White
    var onDragStart = function(source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^b/) !== -1) {
            return false;
        }
    };

    var makeRandomMove = function() {
        var possibleMoves = game.moves();

        // game over
        if (possibleMoves.length === 0) return;

        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIndex]);
        board.position(game.fen());
    };

    var onDrop = function(source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';

        // make random legal move for black
        window.setTimeout(makeRandomMove, 250);
    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    var onSnapEnd = function() {
        board.position(game.fen());
    };

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);

    $('#startPositionBtn').on('click', board.start);
    $('#clearBoardBtn').on('click', board.clear);
}

function HumanVsHuman()
{
    var boardElement = document.getElementById('board');
    var boardElement2 = document.getElementById('board2');
    boardElement.display = 'none';
    boardElement2.display = 'initial';

    var board,
        game = new Chess(),
        statusEl = $('#status'),
        fenEl = $('#fen'),
        pgnEl = $('#pgn');

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
    var onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

    var onDrop = function(source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';

        updateStatus();
    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    var onSnapEnd = function() {
        board.position(game.fen());
    };

    var updateStatus = function() {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        }

        // checkmate?
        if (game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.in_draw() === true) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';

            // check?
            if (game.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        statusEl.html(status);
        fenEl.html(game.fen());
        pgnEl.html(game.pgn());
    };

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board2', cfg);

    updateStatus();

    $('#startPositionBtn').on('click', board.start);
    $('#clearBoardBtn').on('click', board.clear);
}

function start()
{
    var gameModeElement = document.getElementById('gameMode');
    var gameMode = getParameterByName('gameMode');
    if(gameMode == 0)
    {
        gameModeElement.innerHTML='Human Vs Computer';
        HumanVsComputer();
    }
    else
    {
        gameModeElement.innerHTML='Human Vs Human';
        HumanVsHuman();
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.onload = start;


