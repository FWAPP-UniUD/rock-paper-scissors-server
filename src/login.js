import $ from 'jquery';
import page from 'page';

const htmlTemplate = () => `
<form class="ui form">
  <div class="field">
    <label>Username</label>
    <input type="text" name="username" placeholder="Username">
  </div>
  <div class="field">
    <label>Password</label>
    <input type="password" name="password" placeholder="Password">
  </div>  
  <div class="ui error message">
    <div class="header">Error</div>
    <p>Placeholder for error message.</p>
  </div>
  <button class="ui button" type="submit">Submit</button>
</form>
`;
class Login {
    constructor() {        
        this.mainElement = document.createElement('div');         
        $(this.mainElement).html(htmlTemplate());
    }
    attach(containerElement) {
        $(containerElement).append(this.mainElement);
        // these settings should be here, if not they will not work because the DOM is not mounted
        $(this.mainElement).find('.error').hide();
        $(this.mainElement).find('button[type="submit"]').click(this.submit.bind(this));        
    }
    submit(event) {
        event.preventDefault();
        const data = {};
        $(this.mainElement).find('form').serializeArray().forEach((field) => { 
            data[field.name] = field.value; 
        }); 
        fetch('/api/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }  else          
                throw Error(response.statusText);
        }).then((data) => {
            localStorage.setItem('logged_in', true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.name);
            page.redirect('/play');
        }).catch((error) => {
            $(this.mainElement).find('form').addClass('error');
            $(this.mainElement).find('form .message p').text(error.message);
            $(this.mainElement).find('form .message').show();
        });
    }
    logout() {
        localStorage.removeItem('logged_in');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

export default Login;