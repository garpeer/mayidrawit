Lerajzolhatom = function($, container){
    var options = {
        classes: {
            yep: 'yep',
            nope: 'nope',
            other: 'other'
        },
        questionfile: 'assets/questions.json'
    }
    var questions;
    var question = -1;
    var answers = [];
    container.append($('<button>').addClass('start').text('Kezdjük').click(function(){
        setup();
    }));
    
    var setup = function(){
        container.empty();
        container.addClass('waiting');
        $.ajax({
            url: options.questionfile,
            dataType: 'json',
            success: function(data){
                if (data){
                    questions = process_questions(data);
                    container.removeClass('waiting');
                    proceed();
                }
            }
        });
    }
    var proceed = function(value){
        question++;
        display();
    }
    var back = function(){
        question--;
        console.log(question);
        display();
    }
    var display = function(){
        container.empty();
    }
    var error = function(){
        container.empty();
        console.log('ERROR');
    }
};
jQuery(document).ready(Lerajzolhatom(jQuery, $('#container')));
