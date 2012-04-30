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
                    initialize(data.questions);
                }
            }
        });
    }));

    var initialize = function(data){
        var display = function(elem){
            return {
                display: function(content){
                    elem.empty();
                    elem.html(content);
                },
            }
        }(container);

        var question = function(display, data){
            var current;
            var questions = [];
            var i = -1;
            var parse_question = function(data, parent){
                i++;
                var id = i;
                var item = {}
                for (o in data){
                    if (o == 'question'){
                        item.question = data[o];
                    }else{
                        item[o] = parse_question(data[o], id);
                    }
                }
                item['parent'] = parent;
                questions[id] = item;
                return id;
            };
            parse_question(data);

            //console.log('questionlist:' ,questions);
            for (i in questions){
                console.log(i, questions[i])
            }
            var get_text = function(){
                return 'X';
            }
            return {
                next: function(value){
                    current++;
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
