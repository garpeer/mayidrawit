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
        container.empty();
        container.addClass('waiting');
        $.ajax({
            url: options.questionfile,
            dataType: 'json',
            success: function(data){
                if (data){
                    container.removeClass('waiting');
                    initialize(data);
                }
            }
        });
    }));

    var initialize = function(data){
        var display = function(elem){
            return {
                display: function(content){
                    console.log(content);
                    elem.empty();
                    elem.html(content);
                },
            }
        }(container);

        var question = function(display, data){
            var current;
            var questions = data;            
            var get_text = function(){
                return 'X';
            }
            return {
                next: function(value){
                    current++;
                    console.log(value);
                    display.display('nexty');
                },
                back: function(){
                    current--;
                    display.display('prevy');
                }
            }
        }(display, data)
        question.next();
    }



};
jQuery(document).ready(Lerajzolhatom(jQuery, $('#container')));
