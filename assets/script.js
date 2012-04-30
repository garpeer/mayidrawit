Lerajzolhatom = function(container){
    var options = {
        classes: {
            yep: 'yep',
            nope: 'nope',
            other: 'other'
        },
        questionfile: 'assets/questions.js'
    }
    var questions;
    var question = -1;
    var answers = [];
    container.append($('<button>').addClass('start').text('Kezdjük').click(function(){
        proceed();
    }));
    
    var proceed = function(value){
        question++;
        console.log(value + ' ' + question);
        display();
    }
    var back = function(){
        question--;
        console.log(question);
        display();
    }
    var display = function(){
        
    }
};
$(document).ready(Lerajzolhatom($('#container')));
