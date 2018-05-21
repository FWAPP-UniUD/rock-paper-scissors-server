import $ from 'jquery';

class RockPaperScissors {
    constructor(containerElement) {
        this.win = 0;
        this.labels = [ "Rock", "Paper", "Scissors" ];
        // this is a convenient way to define a fragment of HTML
        // that could be installed for this componen
        // notice the map()/join() for evaluating a "for"-like loop
        const htmlTemplate = `
<!-- 
  embedding everything in a "<div>" is not needed, in general, however
  it is react-/web component-inspired
-->
<div>
    <h2 class="header">Your game</h2>
    <div class="ui grid segment">
    <!-- this illustrates a "for"-like creation of multiple HTML elements -->
        ${this.labels.map(l => 
        `
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
    <div class="ui modal">
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

        // the main DOM element has to be constructed with the DOM
        // manipulation functions (because we need it as the starting-point
        // of the subtree for further jQuery accesses)
        this.mainElement = document.createElement('div');
        // the mainElement content becomes the htmlTemplate and it is added
        // to the containerElement
        // notice that, for manipulating it through jQuery it must be "encapsulated"
        // into a jQuery node with the $() call
        $(this.mainElement).html(htmlTemplate).appendTo(containerElement);  
        // the button that will fire the game is now addressable thanks
        // to the my-play class (alternatively an id can be used)
        $(this.mainElement).find('button.my-play').click(this.buttonPressed.bind(this));        
    }
    randomDraw() {
        const v = Math.floor(3 * Math.random());
        this.opponentChoice = this.labels[v];
    }
    determineWinner(choice) {
        if (this.opponentChoice == "Rock") {
            switch (choice) {
            case "Rock": return "tie";            
            case "Paper": return "you";
            case "Scissors": return "opponent";
            }
        }
        else if (this.opponentChoice == "Paper") {
            switch (choice) {
            case "Rock": return "opponent";            
            case "Paper": return "tie";
            case "Scissors": return "you";
            }
        }
        else {
            // this.opponentChoice == "Scissors"
            switch (choice) {
            case "Rock": return "you";            
            case "Paper": return "opponent";
            case "Scissors": return "tie";
            }
        }
    }
    buttonPressed(event) {
        const myChoice = $('input[name="choice"]:checked', this.mainElement);
        if (myChoice.length == 0) {
            $(this.mainElement).find('.modal').modal('show');
        } else {
            this.randomDraw();
            /* determine a winner */
            const winner = this.determineWinner(myChoice.val());
            $(this.mainElement).find('.my-result').text(this.opponentChoice);
            const resultbox = $(this.mainElement).find('.my-resultbox');
            resultbox.removeClass("positive negative info");

            if (winner == 'you') {
                this.win++;
                resultbox.addClass("positive");
            }
            else if (winner == 'tie') 
                resultbox.addClass("info");
            else
                resultbox.addClass("negative");
            $('<div>').text(this.win).appendTo(this.mainElement);
        }
    }
}

export default RockPaperScissors;