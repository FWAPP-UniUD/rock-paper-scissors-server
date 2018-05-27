import { Router } from 'express';
import jwt from 'express-jwt';
import config from './config';
import Game from './models/game';

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
    throw new Error('Invalid choice');
};

// install jwt middleware
router.use(jwt({ secret: config.secret_key }));

router.get('/', function(req, res) {
    // this is supposed to send statistics about the game
    Game.findOne({ user: req.user._id }).then(function(game) {
        if (!game) {
            game = { user: req.user._id, stats: { player: 0, opponent: 0, tie: 0 } };
            Game.create(game);
        } 
        res.send(game);
    }).catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});

router.post('/', function(req, res, next) {
    // this is supposed to handle a single game play
    const game = req.body;
    if (typeof(game) != 'object' || !("playerChoice" in game)) {
        res.status(400).send('Expecting a JSON object with a "playerChoice" field');
        next(new Error('Expecting a JSON object with a "playerChoice" field'));
        return;
    } 

    const v = Math.floor(labels.length * Math.random());    
    const winner = determineWinner(game.playerChoice, labels[v]); 
    const index = ["player", "opponent", "tie"].indexOf(winner);

    Game.findOne({ user: req.user._id }).then(function(game) {
        if (!game) {
            game = { user: req.user._id, stats: { player: 0, opponent: 0, tie: 0 } };
            game.stats[winner]++;
            Game.create(game);
        } else {
            game.stats[winner]++;            
            game.save();
        }
        res.json({ 
            playerChoice: game.playerChoice,
            opponentChoice: labels[v],
            winner
        });
    })
    .catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});

export default router;