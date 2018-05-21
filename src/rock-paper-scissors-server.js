import $ from 'jquery';
import RockPaperScissors from './rock-paper-scissors';

class RockPaperScissorsServer extends RockPaperScissors {  
    updateStatus(response) {  
        const winner = response.winner;     
        $(this.mainElement).find('.my-result').text(response.opponentChoice);
        const resultbox = $(this.mainElement).find('.my-resultbox');
        resultbox.removeClass("positive negative info");
        if (winner == 'player')
            resultbox.addClass("positive");
        else if (winner == 'tie') 
            resultbox.addClass("info");
        else
            resultbox.addClass("negative");
    }
    buttonPressed(event) {
        const myChoice = $('input[name="choice"]:checked', this.mainElement);
        if (myChoice.length == 0) {
            $(this.mainElement).find('.modal').modal('show');
        } else {
            const playerChoice = myChoice.val();
            fetch('/rps-game', {
                method: "POST",   
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },             
                body: JSON.stringify({
                    playerChoice: myChoice.val()
                })
            }).then(response => response.json())
            .then(this.updateStatus.bind(this));
        }            
    }
}

export default RockPaperScissorsServer;