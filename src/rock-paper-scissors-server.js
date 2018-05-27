import $ from 'jquery';

const htmlTemplate = (labels) => `
<div>
    <h2 class="header">Your game</h2>
    <div class="ui grid segment">
    <!-- this illustrates a "for"-like creation of multiple HTML elements -->
        ${labels.map(l => `
            <div class="four columns center aligned">    
                <input type="radio" value="${l}" name="choice"/> 
                <label class="ui label">
                    <i class="hand ${l.toLowerCase()} icon"></i>
                    ${l}
                </label>
            </div>
        `).join("\n")}
    </div>
    <button class="ui button labeled icon my-play">
    <i class="angle double right icon"></i> Play!
    </button>
    <!-- this will be the modal for showing the no-selected option message -->
    <div class="ui fullscreen modal my-warning">
        <div class="content">
        You must choose an option
        </div>
        <div class="actions">
        <button class="ui ok button">Ok</button>
        </div>
    </div>
    <div class="ui message my-resultbox">
      <h2 class="header">Your opponent played</h2>
      <p class="my-result"></p>
    </div>
</div>
`;

class RockPaperScissors {
    constructor() {
        this.labels = [ "Rock", "Paper", "Scissors" ];        
        this.mainElement = document.createElement('div');
        $(this.mainElement).html(htmlTemplate(this.labels));
    }

    attach(containerElement) {
        $(containerElement).append(this.mainElement);
        $(this.mainElement).find('button.my-play').click(this.buttonPressed.bind(this));        
    }
   
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
            $('.modal.my-warning').modal('show');
        } else {
            const playerChoice = myChoice.val();
            fetch('/api/rps-game', {
                method: "POST",   
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },             
                body: JSON.stringify({
                    playerChoice: myChoice.val()
                })
            }).then(response => response.json())
            .then(this.updateStatus.bind(this));
        }            
    }
}

export default RockPaperScissors;