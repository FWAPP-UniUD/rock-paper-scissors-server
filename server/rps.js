import { Router } from 'express';

const router = Router();

const labels = [ "Rock", "Paper", "Scissors" ];

const determineWinner = (playerChoice, opponentChoice) => {
    if (opponentChoice == "Rock") {
        switch (playerChoice) {
        case "Rock": return "tie";            
        case "Paper": return "player";
        case "Scissors": return "opponent";
        }
    }
    else if (opponentChoice == "Paper") {
        switch (playerChoice) {
        case "Rock": return "opponent";            
        case "Paper": return "tie";
        case "Scissors": return "player";
        }
    }
    else {
        // opponentChoice == "Scissors"
        switch (playerChoice) {
        case "Rock": return "player";            
        case "Paper": return "opponent";
        case "Scissors": return "tie";
        }
    }
};

router.get('/', function(req, res) {
    // this is supposed to send statistics about the game
    res.send('Welcome to the RPS game');
});

router.post('/', function(req, res, next) {
    // this is supposed to handle a single game play
    const game = req.body;
    if (!("playerChoice" in game)) {
        res.status(400).send('Expecting a JSON object with a "playerChoice" field');
        next(new Error('Expecting a JSON object with a "playerChoice" field'));
        return;
    } 

    const v = Math.floor(labels.length * Math.random());    
    res.json({ 
        playerChoice: game.playerChoice,
        opponentChoice: labels[v],
        winner: determineWinner(game.playerChoice, labels[v])
    });
});

export default router;