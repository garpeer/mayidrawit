Lerajzolhatom = function($, container){
    var options = {        
        questionfile: 'assets/questions.json?v=2'
    }
    
    var Display;
    var Question;
    var History = window.History;
    
    container.append($("<div>").addClass('start-wrapper').append($('<button>').addClass('start').text('Kezdjük').click(function(){
        startup();
    })));
    
    var startup = function(question){
        container.empty();
        container.addClass('waiting');
        $.ajax({
            url: options.questionfile,
            dataType: 'json',
            success: function(data){
                    if (data){
                        container.removeClass('waiting');
                        initialize(data.questions, question);  
                    }
            }
        });
    }
    
    if (History.enabled ) { 
            var initial_state = History.getState();
            if (initial_state.data.question !== undefined){
                startup(initial_state.data.question);
            }
            History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
                var State = History.getState(); // Note: We are using History.getState() instead of event.state
                var q = State.data.question;
                Question.jump(q);
            });
        }

    var initialize = function(data, initial_question){
        Display = function(elem){
            return {
                display: function(item, controls){
		    elem.fadeOut(150, function(){
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
                        elem.fadeIn(150);
                    });
                }
            }
        }(container);
        
        
        
        
        

        Question = function(display, data, History){
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
                jump: function(id){
                    var question = get_question(id);
                    if (question !== undefined){
                        current = id;
                        show(question);
                        return true;                        
                    }
                },
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
                            History.pushState({question:id},null, "?question="+id);
                            //show(child);
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
                        //show(get_question(question.parent));
                        History.back();
                        return true;
                    }
                }
            }
        }(Display, data, History)
        
        if (initial_question === undefined){
            Question.next();            
        }else{
            Question.jump(initial_question);
        }
        
    }



};
jQuery(document).ready(Lerajzolhatom(jQuery, $('#container')));
