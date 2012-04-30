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
                try{
                    if (data){
                        container.removeClass('waiting');
                        initialize(data.questions);
                    }
                }catch(e){
                    container.empty();
                    container.text('ERROR: '+ e);
                }
            }
        });
    }));

    var initialize = function(data){
        var display = function(elem){
            return {
                display: function(item){
                    elem.empty();
                    elem.html(item.question);
                }
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

//            console.log('questionlist:' ,questions);
//            for (i in questions){
//                console.log(i, questions[i])
//            }            
            var get_question = function(id){
                return questions[id];
            }
            return {
                next: function(value){
                    if (value != 'question'){
                        if (value === undefined){
                            child = get_question(0);
                        }else{
                            question = get_question(current);
                            var child = question[value];
                        }
                        if (child){     
                            current++;
                            display.display(child);
                            return true;
                        }
                    }
                    throw "invalid question child: "+value;
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
