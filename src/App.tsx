import { useState, useEffect } from "react";
import { X, Circle, RotateCcw } from "lucide-react";

type Player = "X" | "O";
type Board = (Player | null)[];

const winningCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],  
	[0, 4, 8],
	[2, 4, 6],
];

const themes = [
	{ label: "Ак 🤍", value: "" },
	{ label: "Кара 🖤", value: "black" },
	{ label: "Кызгыл ❤️", value: "🌸" },
	{ label: "Көк 💙", value: "🐬" },
	{ label: "Сары 💛", value: "🐤" },
	{ label: "Жашыл 💚", value: "dark" },
];

function App() {
	const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "");
  const [textColor, setTextColor] = useState("text-gray-800");

  useEffect(() => {
    // Set or remove the data-theme attribute
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    
    // Apply background color immediately
    document.body.style.backgroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-default");
    
    // Set text color based on theme
    switch(theme) {
      case "black":
        setTextColor("text-black");
        break;
      case "🌸":
        setTextColor("text-red-600");
        break;
      case "🐬":
        setTextColor("text-blue-600");
        break;
      case "🐤":
        setTextColor("text-yellow-500");
        break;
      case "dark":
        setTextColor("text-green-600");
        break;
      default:
        setTextColor("text-gray-800");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);
  
	const [board, setBoard] = useState<Board>(Array(9).fill(null));
	const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
	const [winner, setWinner] = useState<Player | "Тең" | null>(null);
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
			setWinner("Тең");
		}
	};

	const handleClick = (index: number) => {
		if (board[index] || winner) return;

		const newBoard = [...board];
		newBoard[index] = currentPlayer;
		setBoard(newBoard);
		setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
	};

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setCurrentPlayer("X");
		setWinner(null);
		setWinningLine(null);
	};

	useEffect(() => {
		checkWinner(board);
	}, [board]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="m-5">
				<select
					value={theme}
					onChange={(e) => setTheme(e.target.value)}
					className={`focus:outline-none h-10 rounded-full px-3 border ${textColor}`}>
					{themes.map(({ label, value }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>
			<div className="max-w-md w-full">
				<div className={`bg-white rounded-2xl shadow-xl p-8`}>
					<div className="text-center mb-8">
						<h1 className={`text-3xl font-bold ${textColor} mb-2`}>Х-О</h1>
						{!winner && (
							<p className={`${textColor}`}>Оюнчу {currentPlayer} кезеги</p>
						)}
						{winner && (
							<p className={`${textColor}`}>
								{winner === "Тең" ? "Оюн тең чыкты!" : `Оюнчу ${winner} утту!`}
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
                  ${winningLine?.includes(index) ? 
                    theme === "🌸" ? "bg-red-50" :
                    theme === "🐬" ? "bg-blue-50" :
                    theme === "🐤" ? "bg-yellow-50" :
                    theme === "dark" ? "bg-green-50" :
                    "bg-blue-50" : ""}
                  ${!cell && !winner ? "hover:scale-[1.02]" : ""}
                `}>
								{cell === "X" && (
									<X 
                    className={`w-12 h-12 ${
                      theme === "🌸" ? "text-red-600" :
                      theme === "🐬" ? "text-blue-600" :
                      theme === "🐤" ? "text-yellow-500" :
                      theme === "dark" ? "text-green-600" :
                      theme === "black" ? "text-black" :
                      "text-blue-600"
                    }`} 
                    strokeWidth={2.5} 
                  />
								)}
								{cell === "O" && (
									<Circle
										className={`w-12 h-12 ${
                      theme === "🌸" ? "text-red-600" :
                      theme === "🐬" ? "text-blue-600" :
                      theme === "🐤" ? "text-yellow-500" :
                      theme === "dark" ? "text-green-600" :
                      theme === "black" ? "text-black" :
                      "text-rose-600"
                    }`}
										strokeWidth={2.5}
									/>
								)}
							</button>
						))}
					</div>

					<button
						onClick={resetGame}
						className={`w-full py-3 px-6 rounded-lg ${
              theme === "🌸" ? "bg-red-600" :
              theme === "🐬" ? "bg-blue-600" :
              theme === "🐤" ? "bg-yellow-500" :
              theme === "dark" ? "bg-green-600" :
              theme === "black" ? "bg-black" :
              "bg-gray-800"
            } text-white font-medium
            flex items-center justify-center gap-2 transition-all duration-200
            hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400`}>
						<RotateCcw className="w-5 h-5" />
						Жаңы оюн
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;