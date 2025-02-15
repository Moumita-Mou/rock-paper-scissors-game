# Rock Paper Scissors Game App

**Rock Paper Scissors Game App** is a fun and engaging mobile game built using [Expo Snack](https://snack.expo.dev/), [Node.js](https://nodejs.org/), and [AsyncStorage](https://reactnative.dev/docs/asyncstorage) from React Native for temporary data storage. Users can play the classic "Rock, Paper, Scissors" game and track their game history with temporary storage.

## Features

- **Classic Gameplay**: Play the traditional "Rock, Paper, Scissors" game.
- **AsyncStorage Integration**: Stores game results and player scores temporarily.
- **Responsive UI**: Optimized for mobile experience.
- **Cross-Platform**: Works on both iOS and Android.


## Installation

To run the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/Moumita-Mou/rock-paper-scissors-game.git
   ```

2. Navigate to the project directory:

   ```bash
   cd rock-paper-scissors-game
   ```

3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Install the Expo CLI globally if it's not already installed:

   ```bash
   npm install -g expo-cli
   ```

5. Start the Expo development server:

   ```bash
   expo start
   ```

6. You can now open the app on your mobile device using the Expo Go app or in a simulator.

## How It Works

- The user selects between **Rock**, **Paper**, or **Scissors**, and the app generates a random choice for the opponent.
- The game logic follows the basic rules:
  - Rock beats Scissors
  - Scissors beats Paper
  - Paper beats Rock
- Results are displayed, and the game history is stored temporarily using AsyncStorage for reviewing performance during the session.

## Current Status

- The game is fully functional, and game history is stored temporarily during the session.
- Future improvements may include more complex game modes, multiplayer support, and enhanced UI features.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed by running:

   ```bash
   npm install
   ```

2. Clear Expo's cache:

   ```bash
   expo start -c
   ```

3. Verify that AsyncStorage is working by testing the app's ability to store and retrieve game data.

4. Ensure Node.js is properly installed by checking the version:

   ```bash
   node -v
   ```

## Using Expo Snack

This project was created using Expo Snack. Here's how you can get started:

- Open the `App.js` file to start writing or modifying code.
- You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators.
- When you're done, click **Save** and share the project via the Snack link.

You can download your project and use it with [Expo CLI](https://docs.expo.dev/get-started/installation/#expo-cli) when you're ready to see everything Expo provides or if you prefer to use your own editor.

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

### Need Help?

If you're having issues creating projects using Expo Snack:

- Tweet [@expo](https://twitter.com/expo).
- Ask in the [Expo forums](https://forums.expo.dev/c/expo-dev-tools/61).
- Join the conversation on [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).



