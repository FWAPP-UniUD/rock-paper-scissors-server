import mongoose from 'mongoose';

const game_schema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    stats: {
        player: Number,
        opponent: Number,
        tie: Number
    }
});

const Game = mongoose.model('Game', game_schema);

export default Game;
