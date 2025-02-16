import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw } from 'lucide-react';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Катарлар
  [0, 3, 6], [1, 4, 7], [2, 4, 8], // Мамылар
  [0, 4, 8], [2, 4, 6] // Диагоналдар
];

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Тең' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (boardState: Board): void => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        setWinner(boardState[a] as Player);
        setWinningLine(combo);
        return;
      }
    }
    
    if (!boardState.includes(null)) {
      setWinner('Тең');
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
  };

  useEffect(() => {
    checkWinner(board);
  }, [board]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Х-О</h1>
            {!winner && (
              <p className="text-gray-600">
                Оюнчу {currentPlayer} кезеги
              </p>
            )}
            {winner && (
              <p className="text-gray-600">
                {winner === 'Тең' ? "Оюн тең чыкты!" : `Оюнчу ${winner} утту!`}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={!!winner}
                className={`
                  h-24 bg-gray-50 rounded-lg flex items-center justify-center
                  transition-all duration-200 hover:bg-gray-100
                  ${winningLine?.includes(index) ? 'bg-blue-50' : ''}
                  ${!cell && !winner ? 'hover:scale-[1.02]' : ''}
                `}
              >
                {cell === 'X' && (
                  <X
                    className="w-12 h-12 text-blue-600"
                    strokeWidth={2.5}
                  />
                )}
                {cell === 'O' && (
                  <Circle
                    className="w-12 h-12 text-rose-600"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={resetGame}
            className="w-full py-3 px-6 rounded-lg bg-gray-800 text-white font-medium
                     flex items-center justify-center gap-2 transition-all duration-200
                     hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <RotateCcw className="w-5 h-5" />
            Жаңы оюн
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
