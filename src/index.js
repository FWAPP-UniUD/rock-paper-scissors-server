import RPS from './rock-paper-scissors-server';
import Login from './login';
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import page from 'page';

const container = document.querySelector(".my-component");

page('/', index);
page('/play', play);
page('/login', login);
page('/logout', logout);
page('*', notfound);

const loginComponent = new Login(), rpsComponent = new RPS();

function index() {
    $(container).empty();
}

function login() {
    if (localStorage.getItem('logged_in')) {
        page.redirect('/play');
    } else {
        $(container).empty();
        loginComponent.attach(container);
    }
}

function logout() {
    $(container).empty();
    loginComponent.logout();        
    page.redirect('/');
}

function play() {
    if (localStorage.getItem('logged_in')) {
        $(container).empty();
        rpsComponent.attach(container);
    } else {
        page.redirect('/login');
    }
}

function notfound() {
    $(container).empty();
}

page.start();