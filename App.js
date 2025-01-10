import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Modal,
  ScrollView} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const choices = ['rock', 'paper', 'scissors'];
const outcomes = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};


const MenuBar = ({
  onStartGame,
  onInstructions,
  onScoreboard,
  onExitGame,
}) => {

const [menuOpenSound, setMenuOpenSound] = useState(null);

  const playMenuOpenSound = async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('./assets/menubar_page_audio.wav'));
      await sound.playAsync();
      setMenuOpenSound(sound);
    } catch (error) {
      console.log('Menu open sound loading and playing failed:', error);
    }
  };

  const stopMenuOpenSound = async () => {
    if (menuOpenSound) {
      await menuOpenSound.unloadAsync();
    }
  };

  // Play the sound when the menu bar page is shown
  useEffect(() => {
    playMenuOpenSound();
    

    return () => {
      stopMenuOpenSound();
    };
  }, []); 

  const playButtonClickSound = async () => {
    const buttonClickSound = new Audio.Sound();
    try {
      await buttonClickSound.loadAsync(require('./assets/menu_button_click_sound.wav'));
      await buttonClickSound.playAsync();
    } catch (error) {
      console.log('Button click sound loading and playing failed:', error);
    }
  };
  
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.gameTitle}>Rock-Paper-Scissors Game</Text>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          playButtonClickSound(); // Play sound when button is clicked
          onStartGame(stopMenuOpenSound());
        }}
      >
        <Text style={styles.menuButtonText}>New Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          playButtonClickSound(); // Play sound when button is clicked
          onInstructions();
        }}
      >
        <Text style={styles.menuButtonText}>Instructions</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          playButtonClickSound(); // Play sound when button is clicked
          onScoreboard();
        }}
      >
        <Text style={styles.menuButtonText}>Scoreboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          playButtonClickSound(); // Play sound when button is clicked
          onExitGame();
        }}
      >
        <Text style={styles.menuButtonText}>Quit Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const placeholderScores = [
  { userScore: 50, computerScore: 25 },
  { userScore: 30, computerScore: 40 },
];

const ScoreboardPage = ({ topScores, onMainMenu }) => {
  const combinedScores = [...topScores, ...placeholderScores];

  return (
    <View style={styles.scoreboardContainer}>
      <Text style={[styles.scoreboardTitle, styles.centerText]}>Scoreboard</Text>
      <ScrollView style={styles.scoreboardScrollView}>
        <View style={styles.scoreboardTable}>
          <View style={styles.scoreboardTableHeader}>
            <Text style={styles.scoreboardHeaderText}>User Score</Text>
            <Text style={styles.scoreboardHeaderText}>Computer Score</Text>
          </View>
          {combinedScores.map((item, index) => (
            <View key={index} style={styles.scoreboardTableRow}>
              <Text style={styles.scoreboardText, styles.centerText}>{item.userScore}</Text>
              <Text style={styles.scoreboardText, styles.centerText}>{item.computerScore}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.mainMenuButton} onPress={onMainMenu}>
        <Text style={styles.mainMenuButtonText}>Main Menu</Text>
      </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default function App() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userChoiceGreen, setUserChoiceGreen] = useState(null);
  const [computerChoiceGreen, setComputerChoiceGreen] = useState(null);
  const [choicesTurnedGreen, setChoicesTurnedGreen] = useState(false);
  const [roundCount, setRoundCount] = useState(1);
  const [userWinCount, setUserWinCount] = useState(0);
  const [computerWinCount, setComputerWinCount] = useState(0);
  const [bothWinCount, setBothWinCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [gameEnd, setGameEnd] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const [showBanner, setShowBanner] = useState(true); // State to control whether to show the banner page
  const [loadingPercentage, setLoadingPercentage] = useState(0); // State to track loading percentage

  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const [showScoreboard, setShowScoreboard] = useState(false);
  const [topScores, setTopScores] = useState([]);
  const [showScoreboardModal, setShowScoreboardModal] = useState(false);

  const [ticTicSound, setTicTicSound] = useState(null);


  const playTicTicSound = async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('./assets/tic_tic.mp3'));
      await sound.playAsync();
      setTicTicSound(sound); // Store the sound object in state
    } catch (error) {
      console.log('Tic tic sound loading and playing failed:', error);
    }
  };

  const stopTicTicSound = async () => {
    if (ticTicSound) {
      await ticTicSound.unloadAsync();
      setTicTicSound(null); // Clear the sound object from state
    }
  };

  const victorySound = new Audio.Sound();

  const playVictorySound = async () => {
    try {
      await victorySound.loadAsync(require('./assets/win.mp3'));
      await victorySound.playAsync();
    } catch (error) {
      console.log('Victory sound loading and playing failed:', error);
    }
  };

  const defeatSound = new Audio.Sound();

  const playDefeatSound = async () => {
    try {
      await defeatSound.loadAsync(require('./assets/lose.wav'));
      await defeatSound.playAsync();
    } catch (error) {
      console.log('Defeat sound loading and playing failed:', error);
    }
  };

  const TieSound = new Audio.Sound();

  const playTieSound = async () => {
    try {
      await TieSound.loadAsync(require('./assets/tie.wav'));
      await TieSound.playAsync();
    } catch (error) {
      console.log('Tie sound loading and playing failed:', error);
    }
  };

 useEffect(() => {
    const loadingSound = new Audio.Sound();

    const playLoadingSound = async () => {
      try {
        await loadingSound.loadAsync(require('./assets/intro-audio.wav'));
        await loadingSound.playAsync();
      } catch (error) {
        console.log('Loading sound loading and playing failed:', error);
      }
    };
    

    const loadingPromise = new Promise(async (resolve) => {
      await playLoadingSound();
  

      // Simulate loading progress from 0% to 100%
      let currentPercentage = 0;
      const loadingInterval = setInterval(() => {
        currentPercentage += 1;
        setLoadingPercentage(currentPercentage);
        if (currentPercentage === 100) {
          clearInterval(loadingInterval);
          resolve();
        }
      }, 70); // Adjust the interval for a smoother animation
    });

    loadingPromise.then(() => {
      // Loading is completed, stop and unload the loading sound
      loadingSound.stopAsync();
      loadingSound.unloadAsync();
      // Hide the loading banner and show the menu
      setShowBanner(false);
    });

    return () => {
      // Clean up loading sound when the component is unmounted
      loadingSound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && userChoice === null) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [gameStarted, timeLeft, userChoice]);

  const generateComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const handleUserChoice = (choice) => {
    setUserChoiceGreen(choice);
    const computerChoice = generateComputerChoice();
    setUserChoice(choice);
    setComputerChoiceGreen(computerChoice);
    setTimeout(() => {
      determineWinner(choice, computerChoice);
    }, 2000);
  };

 const determineWinner = (userChoice, computerChoice) => {
  setComputerChoice(computerChoice);

  if (userChoice === computerChoice) {
    setResult(`Round ${roundCount}: It's a tie! You both chose ${userChoice}.`);
    setBothWinCount((prevCount) => prevCount + 1);
  } else if (outcomes[userChoice] === computerChoice) {
    setResult(`Round ${roundCount}: You win! Computer chose ${computerChoice}.`);
    setUserScore((prevScore) => prevScore + 10);
  } else {
    setResult(`Round ${roundCount}: You lose! Computer chose ${computerChoice}.`);
    setComputerScore((prevScore) => prevScore + 10);
  }

  stopTicTicSound();
  setChoicesTurnedGreen(true);
  setTotalRounds((prevRounds) => prevRounds + 1);
};

  const handleTimeUp = () => {
    if (userChoice === null) {
      const computerChoice = generateComputerChoice();
      setComputerChoiceGreen(computerChoice);
      setResult(`Round ${roundCount}: Time's up! You didn't choose in time. Computer chose ${computerChoice}.`);
      setChoicesTurnedGreen(true);
      setTotalRounds((prevRounds) => prevRounds + 1);
    }
  };

  const handleNewGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setUserChoiceGreen(null);
    setComputerChoiceGreen(null);
    setTimeLeft(30);
    setGameStarted(true);
    setRoundCount(1);
    setUserWinCount(0);
    setComputerWinCount(0);
    setBothWinCount(0);
    setTotalRounds(1);
    setGameEnd(false);
    setShowScoreboard(false);
    setChoicesTurnedGreen(false); // Reset to false when starting a new game
    playTicTicSound();
   
  };

  const handleScoreboard = () => {
   
    console.log('Scoreboard button pressed');
    setShowInstructions(false); // Close any open modals
    setShowBanner(false); // Hide the banner
    setShowScoreboard(true); // Show the scoreboard
    setShowScoreboardModal(true);
  };

  const handleGameEnd = () => {
 
   // Store the game scores
  const newScore = { userScore, computerScore, timestamp: new Date().toLocaleString() };
  const updatedScores = [...topScores, newScore];

  // Store scores in AsyncStorage
  AsyncStorage.setItem('scores', JSON.stringify(updatedScores))
    .then(() => {
      console.log('Scores stored successfully:', updatedScores);
    })
    .catch((error) => {
      console.error('Error storing scores:', error);
    });

  setTopScores(updatedScores); // Update the local state with the new scores
  setGameEnd(true);
    
};

  const handleExitGame = () => {
    Alert.alert(
      'Confirm Exit',
      'Do you want to exit the game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => exitGame() },
      ],
      { cancelable: true }
    );
  };

  const handleExitToMenu = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setUserChoiceGreen(null);
    setComputerChoiceGreen(null);
    setTimeLeft(30);
    setGameStarted(false);
    setChoicesTurnedGreen(false);
    setRoundCount(1);
    setUserWinCount(0);
    setComputerWinCount(0);
    setBothWinCount(0);
    setGameEnd(false);
  };

  const handlePlayAgain = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setUserChoiceGreen(null);
    setComputerChoiceGreen(null);
    setTimeLeft(30);
    setChoicesTurnedGreen(false);
    setRoundCount(1); // Reset the round count to 1
    setUserWinCount(0); // Reset the user's win count to 0
    setComputerWinCount(0); // Reset the computer's win count to 0
    setBothWinCount(0);
    setGameEnd(false);
    setUserScore(0); 
    setComputerScore(0); 
    setShowScoreboard(false);
    playTicTicSound();
    
  };

  const handleKeepPlaying = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setUserChoiceGreen(null);
    setComputerChoiceGreen(null);
    setTimeLeft(30);
    setChoicesTurnedGreen(false);
    playTicTicSound();
    setRoundCount((prevCount) => prevCount + 1);
    
  };

  const handleStartOver = () => {
    
    setGameEnd(true);
    handleGameEnd();
    setShowScoreboard(false);    
    
  };

  const handleMainMenu = () => {
  // Logic to navigate back to the main menu or perform any other action
  setShowScoreboardModal(false); // Close the scoreboard modal
  // You can add more logic here if needed, such as navigating back to the main menu
  // or resetting game state, etc.
  
};

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  const handleExitInstructions = () => {
    setShowInstructions(false);
  };

   const renderInstructionsModal = () => {
    return (
      <Modal
        visible={showInstructions}
        animationType="slide"
        transparent={false}
        onRequestClose={handleExitInstructions}
      >
        <SafeAreaView style={styles.instructionsContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.instructionsContentContainer}   
          >
            <Text style={styles.instructionsText}>
              {/* Place your detailed instructions for the game here */}
              {`
                 
  Instructions to play Rock-Paper-Scissors Game:

  1. Rock beats Scissors: If you choose Rock and the computer chooses Scissors, you win.

  2. Paper beats Rock: If you choose Paper and the computer chooses Rock, you win.

  3. Scissors beats Paper: If you choose Scissors and the computer chooses Paper, you win.

  4. If both you and the computer choose the same option, it's a tie.

  5. The game consists of multiple rounds. For each win, you have 10 points. The player with the highest score in the game end is the winner.

  6. You have 30 seconds to make your choice in each round. If you don't choose within the time limit, the computer will make a random choice for you. 

  7. Have fun and enjoy the game!`
              
              }
            </Text>
            <TouchableOpacity style={styles.exitInstructionsButton} onPress={handleExitInstructions}>
              <Text style={styles.exitInstructionsText}>Close Instructions</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };



  const exitGame = () => {
    // Replace this with the code to exit the app on your specific environment.
    // Expo Snack doesn't support app exit, so we use console.log here.
    console.log('Exiting the game...');
  };

  const renderBannerPage = () => {
    if (showBanner) {
      return (
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerText}>Rock-Paper-Scissors Game</Text>
          <View style={styles.progressBarContainer}>
             <View style={[styles.progressBar, { width: `${loadingPercentage}%` }]} />
          </View>
          <Text style={styles.loadingPercentage}>Loading {loadingPercentage}%</Text>
        </View>
      );
    }
    return null;
  };


  const renderChoices = () => {
  return (
    <>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time Left: {timeLeft} seconds</Text>
        <Text style={styles.roundText}>Round: {roundCount}</Text>
      </View>
      <View style={styles.scoreDisplay}>
        <Text style={styles.scoreDisplayText}>Your Score: <Text style={styles.scoreCount}>{userScore}</Text></Text>
        <Text style={styles.scoreDisplayText}>Computer Score: <Text style={styles.scoreCount}>{computerScore}</Text></Text>
      </View>
      <View style={styles.choicesContainer}>
        <Text style={styles.playerText}>Computer</Text>
        <View style={styles.playerChoices}>
          {choices.map((choice) => (
            <TouchableOpacity
              key={choice}
              style={[
                styles.choiceButton,
                computerChoiceGreen === choice && styles.chosenButton,
              ]}
              disabled={userChoice !== null}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.playerText}>Human</Text>
        <View style={styles.playerChoices}>
          {choices.map((choice) => (
            <TouchableOpacity
              key={choice}
              style={[
                styles.choiceButton,
                userChoiceGreen === choice && styles.chosenButton,
              ]}
              onPress={() => handleUserChoice(choice)}
              disabled={userChoice !== null}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};


const renderGameEnd = () => {
  let winner = null;

  if (userScore > computerScore) {
    winner = `You Win!`;
    playVictorySound();
  } else if (computerScore > userScore) {
    winner = `You Lose! Computer Win!`;
    playDefeatSound();
  } else {
    winner = `You Both Win!`;
    playTieSound();
  }

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Game Over</Text>
      <Text style={styles.winnerText}>{winner}</Text>
      <Text style={styles.scoreText}>Your Score: <Text style={styles.scoreCount}>{userScore}</Text></Text>
      <Text style={styles.scoreText}>Computer Score: <Text style={styles.scoreCount}>{computerScore}</Text></Text> 
      <Text style={styles.scoreText}>Total Game Tied: <Text style={styles.tieCount}>{bothWinCount}</Text></Text>
      <Text style={styles.scoreText}>Total Rounds Played: <Text style={styles.roundCount}>{totalRounds}</Text></Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitGameButton} onPress={handleExitToMenu}>
          <Text style={styles.exitGameText}>Exit Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



  const renderRoundEnd = () => {
   
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Round {roundCount} Result </Text>
      <Text style={styles.scoreText}>Your Score: <Text style={styles.scoreCount}>{userScore}</Text></Text>
      <Text style={styles.scoreText}>Computer Score: <Text style={styles.scoreCount}>{computerScore}</Text></Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.keepPlayingButton} onPress={handleKeepPlaying}>
          <Text style={styles.keepPlayingText}>Keep Playing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
          <Text style={styles.startOverText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};




const renderNavigationBar = (onExitGame) => {
  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.navButton} onPress={onExitGame}>
        <Text style={styles.navButtonText}>Quit Game</Text>
      </TouchableOpacity>
    </View>
  );
};

  return (
  <SafeAreaView style={styles.container}>
    {showBanner ? (
      renderBannerPage()
    ) : (
      <>
        {!gameStarted ? (
          <MenuBar
            onStartGame={handleNewGame}
            onScoreboard={() => setShowScoreboardModal(true)}
            onExitGame={handleExitGame}
            onInstructions={() => setShowInstructions(true)} 
          />
        ) : (
          <>
            <Text style={styles.gameTitle}>Rock-Paper-Scissors Game</Text>
            {gameEnd ? (
              renderGameEnd()
            ) : (
              <>
                {result ? (
                  renderRoundEnd()
                ) : (
                  renderChoices()
                )}
              </>
            )}
            {renderNavigationBar(handleExitGame)}
          </>
        )}
      </>
    )}
    {/* Call the renderInstructionsModal function to render the instructional modal */}
    {showInstructions && renderInstructionsModal()}
    
    {/* Modal for the scoreboard */}
    <Modal
      visible={showScoreboardModal}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowScoreboardModal(false)}
    >
      <ScoreboardPage topScores={topScores} onMainMenu={handleMainMenu}/>
    </Modal>
  </SafeAreaView>
);


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  bannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Add a background color to the banner
  },
  bannerText:{
    fontWeight: 'bold',
    fontSize: '24',
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: '#ccc', // Add a background color to the progress bar container
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden', // Fix for clipping the progress bar width
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green', // Add a background color to the progress bar
    borderRadius: 10,
  },
  loadingPercentage: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  menuContainer: {
    alignItems: 'center',
  },
  menuButton: {
    marginVertical: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roundText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  choicesContainer: {
    alignItems: 'center',
    marginbottom: '20'
  },
  playerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerChoices: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  choiceButton: {
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  chosenButton: {
    backgroundColor: 'green',
  },
  choiceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,

  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exitGameButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exitGameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playAgainButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  playAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keepPlayingButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  keepPlayingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startOverButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  startOverText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom: 50,
  },
  navButton: {
    paddingHorizontal: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    maxHeight: '60%', // Set the maximum height for the ScrollView
    width: '100%',
  },
  instructionsContainer: {
    flex: 1, // Ensure the container takes the full available space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
  },
  instructionsContentContainer: {
    flexGrow: 1,
    paddingBottom: 40, // Add some extra padding to avoid the close button overlapping the content
  
  },
  instructionsText: {
    fontSize: 18,
    lineHeight: 22,
  },
  exitInstructionsButton: {
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  exitInstructionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreDisplay: {
    left: 5,
    gap: 80,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  scoreDisplayText: {
    fontSize: 16,
    color: 'Black',
    marginBottom: 8,
    fontWeight: 'bold'
  },

  scoreCount: {
    fontWeight: 'bold',
    color: 'green', // Adjust the color as needed
  },
  tieCount:{
    fontWeight: 'bold',
    color: 'green',
  },
  roundCount:{
    fontWeight: 'bold',
    color: 'green',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 7,
    marginBottom: 20,
    textAlign: 'center',
    color: 'green'
  },

  scoreboardContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Added padding to create space at the top
  },
  scoreboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    
  },
  centerText: {
    textAlign: 'center',
  },
  scoreboardScrollView: {
    flex: 1,
  },
  scoreboardTable: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20, // Added margin to create space at the bottom
  },
  scoreboardTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreboardHeaderText: {
    fontWeight: 'bold',
  },
  scoreboardTableRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreboardText: {
    fontSize: 16,
  },
  mainMenuButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center', // Center horizontally
    marginTop: 20, // Add some space between the table and the button
    marginBottom: 10
  },

  mainMenuButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
});
