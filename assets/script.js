Lerajzolhatom = function($, container){
    var options = {
        classes: {
            yep: 'yep',
            nope: 'nope',
            other: 'other'
        },
        questionfile: 'assets/questions.json'
    }
    
    var Display;
    var Question;
    
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
        
        
        
        
        Display = function(elem){
            return {
                display: function(question, controls){
                    elem.empty();
                    elem.append(question);   
                    if (controls){
                        for (var i=0; i<= controls.length; i++){
                            elem.append(controls[i]);
                        }
                    }
                }
            }
        }(container);
        
        
        
        
        

        Question = function(display, data){
            var current = -1;
            var questions = [];
            var i = -1;
            var self = this;
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
            var get_question = function(id){
                var question = questions[id];
                if (question === undefined){
                    throw "invalid question id: "+id;
                }
                return question;
            }
            var show = function(item){
                controls = [];
                for (o in item){
                    if (o != 'question'){
                        if (o == 'parent'){
                            if (item[o] !== undefined && item[o] >= 0){
                                controls.push(
                                    $('<button>').text('Vissza').click(function(e){
                                        Question.back();
                                    })
                                ) 
                            }
                        }else{
                            controls.push($('<button>').text(o).attr('value', o).click(function(e){                                
                                Question.next($(this).attr('value'));
                            }))
                        }
                    }
                }
                
                display.display(item.question, controls);
            }
            return {
                next: function(value){
                    if (value != 'question'){
                        if (value === undefined){
                            child = get_question(0);
                        }else{
                            question = get_question(current);
                            var child = get_question(question[value]);
                        }
                        if (child !== undefined){     
                            current++;
                            show(child);
                            return true;
                        }
                    }
                    throw "invalid question child: "+value;
                },
                back: function(){
                    var question = get_question(current);
                    if (question.parent === undefined){
                        throw "Question "+ current + " is orphan";
                    }else{
                        current--;
                        show(get_question(question.parent));
                        return true;
                    }
                }
            }
        }(Display, data)
        
        
        
        Question.next();
        
        
        
        
    }



};
jQuery(document).ready(Lerajzolhatom(jQuery, $('#container')));
