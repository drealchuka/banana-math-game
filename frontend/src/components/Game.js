import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Game.css';

function Game() {
  const [currentGame, setCurrentGame] = useState(null);
  const [solution, setSolution] = useState(-1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Get ready to play!');
  const [feedbackColor, setFeedbackColor] = useState('black');
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10); // Timer starts at 10 seconds
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'Player';

  // Reference for audio element
  const backgroundAudio = useRef(null);

  useEffect(() => {
    // Fetch the first game when the component mounts
    fetchNextGame();
    
    // Start playing background music when the component mounts
    if (backgroundAudio.current) {
      backgroundAudio.current.play();
    }
  }, []); // Only run once, when the component mounts

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft]);

  // Fetch the next game state from the Banana Game API
  const fetchNextGame = async () => {
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php');
      
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text();

      // Attempt to parse JSON
      const parsedData = JSON.parse(data);
      console.log("Parsed Data:", parsedData);

      if (parsedData && parsedData.question && parsedData.solution !== undefined) {
        setCurrentGame(parsedData.question); // Set image URL for question
        setSolution(parsedData.solution); // Set correct solution
        setFeedback('What is the missing number in the banana?');
        setIsCorrect(null); // Reset feedback for new question
        setTimeLeft(10); // Reset timer for the new game
      } else {
        console.error('Invalid game data:', parsedData);
        setFeedback('Game data is invalid. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching the next game:', error);
      setFeedback('Unable to load the game. Please try again later.');
    }
  };

  // Handle solution submission
  const handleSolution = (value) => {
    if (value === solution) {
      setScore((prevScore) => prevScore + 1);
      setFeedbackColor('green');
      setFeedback(getRandomMessage(true));
      setIsCorrect(true);

      setTimeout(() => {
        fetchNextGame(); // Load the next game after a short delay
      }, 1000);
    } else {
      setFeedbackColor('red');
      setFeedback(getRandomMessage(false));
      setIsCorrect(false);

      // Reset feedback color after a short delay
      setTimeout(() => {
        setFeedbackColor('black');
      }, 1000);
    }
  };

  // Handle what happens when time is up
  const handleTimeUp = () => {
    setFeedbackColor('red');
    setFeedback("Time's up! Moving to the next game.");
    setIsCorrect(false);

    setTimeout(() => {
      fetchNextGame(); // Load the next game after a short delay
    }, 1000);
  };

  // Generate random feedback messages
  const getRandomMessage = (isCorrect) => {
    const positiveMessages = [
      'Fantastic! Keep going!',
      'Awesome! You’re on fire!',
      'Great job! Keep it up!',
    ];
    const tryAgainMessages = [
      'Don’t give up! Try again!',
      'Close! Give it another shot!',
      'Oops! You can do it!',
    ];
    const messages = isCorrect ? positiveMessages : tryAgainMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      navigate('/login');
    }
  };

  return (
    <div className="game-container">
      {/* Audio Element for Background Music */}
      <audio ref={backgroundAudio} src="/playful-fun-uplifting-adventure-music-249187.mp3" loop></audio>

      <h1 className="game-title">The Banana Game</h1>
      <button 
        className="logout-button" 
        onClick={handleLogout} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'firebrick'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Logout
      </button>
      <div className="username-display" style={{ position: 'absolute', top: '10px', right: '120px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
        Welcome, {username}
      </div>
      <div className="timer" style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '18px', fontWeight: 'bold' }}>
        Time Left: {timeLeft} seconds
      </div>
      <div className="score" style={{ position: 'absolute', top: '50px', left: '10px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: '5px 15px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        Score: {score}
      </div>
      <div className="game-question">
        {currentGame ? (
          <img src={currentGame} alt="Current Game" className="game-image" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className={`game-info ${isCorrect ? 'correct-feedback' : ''}`} style={{ color: feedbackColor }}>
        <p>{feedback}</p>
      </div>
      <div className={`game-buttons ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
        {[...Array(10).keys()].map((num) => (
          <button key={num} onClick={() => handleSolution(num)} className="game-button">
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Game;




















































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Game.css';

// function Game() {
//   const [currentGame, setCurrentGame] = useState(null);
//   const [score, setScore] = useState(0);
//   const [feedback, setFeedback] = useState('What is the value of the tomato?');
//   const [feedbackColor, setFeedbackColor] = useState('black');

//   useEffect(() => {
//     fetchNextGame();
//   }, []);

//   // Fetch the next game state from the backend
//   const fetchNextGame = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/nextGame');
//       console.log("Response data:", response.data); // Debug log to see response
//       if (response.data && response.data.gameImage) {
//         console.log("Game Image:", response.data.gameImage);
//         setCurrentGame(response.data.gameImage);
//       }
//     } catch (error) {
//       console.error('Error fetching the next game:', error);
//     }
//   };

//   // Handle solution submission
//   const handleSolution = async (value) => {
//     try {
//       const response = await axios.post('http://localhost:3001/checkSolution', { answer: value });
  
//       if (response.data.correct) {
//         setScore(response.data.score);
//         setFeedbackColor('green');
//         setFeedback(getRandomMessage(true));
//         fetchNextGame(); // Load the next game
//       } else {
//         setFeedbackColor('red');
//         setFeedback(getRandomMessage(false));
//       }
  
//       // Reset feedback color after a short delay
//       setTimeout(() => {
//         setFeedbackColor('black');
//       }, 500);
//     } catch (error) {
//       console.error('Error checking the solution:', error);
//     }
//   };
  

//   // Generate random feedback messages
//   const getRandomMessage = (isCorrect) => {
//     const positiveMessages = [
//       'Fantastic! Keep going!',
//       'Awesome! You’re on fire!',
//       'Great job! Keep it up!',
//     ];
//     const tryAgainMessages = [
//       'Don’t give up! Try again!',
//       'Close! Give it another shot!',
//       'Oops! You can do it!',
//     ];
//     const messages = isCorrect ? positiveMessages : tryAgainMessages;
//     return messages[Math.floor(Math.random() * messages.length)];
//   };

//   return (
//     <div className="game-container">
//       <div className="game-question">
//         {currentGame ? (
//           <img src={currentGame} alt="Current Game" />
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//       <div className="game-info" style={{ color: feedbackColor }}>
//         <p>{feedback} Score: {score}</p>
//       </div>
//       <div className="game-buttons">
//         {[...Array(10).keys()].map((num) => (
//           <button key={num} onClick={() => handleSolution(num)}>
//             {num}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Game;