Lerajzolhatom = function($, container){
    var options = {        
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
                //try{
                    if (data){
                        container.removeClass('waiting');
                        initialize(data.questions);  
                    }
//                }catch(e){
//                    container.empty();
//                    container.text('ERROR: '+ e);
//                }
            }
        });
    }));

    var initialize = function(data){
        
        
        
        
        Display = function(elem){
            return {
                display: function(item, controls){
                    elem.empty();
                    elem.removeClass();
                    if (item['status']){
                        elem.addClass(item['status']);
                    }
                    elem.append($("<p>").html(item.question));
                    if (controls){
                        var controlbox = $('<div>').addClass('controls');
                        for (var i=0; i<= controls.length; i++){
                            controlbox.append(controls[i]);
                        }
                        elem.append(controlbox);
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
                        if (typeof(data[o]) != 'object'){
                            item[o] = data[o];
                        }else{                            
                            item[o] = parse_question(data[o], id);
                        }
                    }
                }
                item['parent'] = parent;
                questions[id] = item;
                return id;
            };
            parse_question(data);
//            for (i in questions){
//                console.log(i, questions[i]);                
//            }
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
                    if (o != 'question' && o != 'status'){
                        if (o == 'parent'){
                            if (item[o] !== undefined && item[o] >= 0){
                                controls.push(
                                    $('<button>').text('Vissza').click(function(e){
                                        Question.back();
                                    })
                                ) 
                            }
                        }else{
                            var label = o;
                            if (o == 'yep'){
                                label = 'Igen';
                            }
                            if (o == 'nope'){
                                label = 'Nem';
                            }
                            controls.push($('<button>').text(label).addClass(o).attr('value', o).click(function(e){                                
                                Question.next($(this).attr('value'));
                            }))
                        }
                    }
                }
                
                display.display(item, controls);
            }
            return {
                next: function(value){
                    if (value != 'question' && value != 'status'){
                        var id;
                        if (value === undefined){
                            child = get_question(0);
                            id = 0;
                        }else{
                            question = get_question(current);
                            id = question[value];
                            var child = get_question(id);
                            
                        }
                        if (child !== undefined){     
                            current = id;
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
                        current = question.parent;
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
