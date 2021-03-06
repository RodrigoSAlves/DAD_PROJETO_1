// 2140972- André Marques Roque
// 2140241- Tiago Rato Fernandes
// 2140970- Rodrigo Silva Alves

// Implementation:

(function() {
	'use strict';
	
	//Global Variables
	var initialTime;
	var currentTimeouts = [];
	var animationsToDo = [];
	var animationRunning = false;

	//Entry point
	var init = function()
	{	
		fillStudentInfo();
		requestBoard();
		$("input:not(.initial)").attr("min", 1).attr("max", 9);
	}

	//Table functions
	var checkTable = function() {  
		var board=[];

		$(".dad-row").find("input").each(function (){
			if($(this).val() !== ""){
				board.push({"line": parseInt($(this).attr("data-line"),10),
					"column": parseInt($(this).attr("data-column"),10),
					"value":$(this).val(),
					"fixed": $(this).prop("disabled")?true:false
				});
			}
		})

		$.ajax({
			url: 'http://198.211.118.123:8080/board/check',
			type: 'POST',
			data: JSON.stringify(board),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(data) {
				if(!data.finished) {
					$("#loading").addClass("invisible");
					for(var i = 0; i < data.conflicts.length; i++)
					{	
						$("input[data-column="+data.conflicts[i].column+"][data-line="+data.conflicts[i].line+"]")
						.addClass("individual-conflict");
					}
					var id = setTimeout(function(){ $("input.individual-conflict").removeClass("individual-conflict"); }, 5000);
					currentTimeouts.push(id);
				}
				else {
					$("input.with-value").addClass("finished");
					showMessageFinish();
				}
			}
		});
	}

	var requestBoard = function()
	{
		var option = $("#select-mode option:selected").val();

		$.get( "http://198.211.118.123:8080/test"/*+option*/)
		.done(function(data) {
			populateInitialTable(data);
			$("#loading").addClass("invisible");
		})
		.fail(function () {
			console.log("Something went wrong");
		});
	}

	var clearTable = function () {
		$(".with-value").val('').removeAttr("value").removeClass("with-value");

		$("input:disabled.initial").removeAttr("disabled").val('').removeAttr("value").removeClass("initial");

		$(".highlight").removeClass("highlight");

		$(".individual-highlight").removeClass("individual-highlight");

		$(".individual-conflict").removeClass("individual-conflict");

		if(currentTimeouts.length !=0 )
			stopTimeouts();

		$(".finished").removeClass("finished");

		animationsToDo=[];
	}

	var populateInitialTable = function(data){
		clearTable();
		for(var i = 0; i < data.length; i++)
		{	
			$("input[data-column="+data[i].column+"][data-line="+data[i].line+"]")
			.val(data[i].value)
			.attr("value", data[i].value)
			.addClass("initial")
			.attr("disabled", true);
		}
		initialTime = new Date();
	}

	//THIS FUNCTION 
	var fillStudentInfo = function () {

		var students = $(".photo-zone");
		$(students[3]).addClass('hidden');

		$(students[0]).find("h3").eq(0).text("2140970");
		$(students[1]).find("h3").eq(0).text("2140972");
		$(students[2]).find("h3").eq(0).text("2140241");

		$(students[0]).find("p").eq(0).text("Rodrigo Silva Alves");
		$(students[1]).find("p").eq(0).text("André Marques Roque");
		$(students[2]).find("p").eq(0).text("Tiago Rato Fernandes");
	}

	//NEW GAME BUTTON
	$("#btn-new").click(function() {
		event.preventDefault();
		$("#loading").removeClass("invisible");
		clearTable();
		requestBoard();
	});

	//CHECK GAME BUTTON
	$("#btn-check").click(function() {
		$("#loading").removeClass("invisible");
		checkTable();
	})

	//EXCEPTION: html type="number" accepts not only numbers but also "e"
	// To solve this exception we need to use keyup as onchange doesn't work
	$("input:not(.initial)").on("keyup", function(event){
		if(event.key == "e"){
			$(this).val("");
		}
	});

	//INPUT THAT CAN BE MODIFIED BUT DOESN'T HAVE A VALUE
	$(".dad-board").on("change", "input:not(.with-value)", function(){

		if( $(this).val() === '' || $(this).val() < 1 || $(this).val() > 9 || $(this).val().length > 1)
		{
			$(this).val("");
		}
		else{
			$(this).addClass("with-value").attr("value", $(this).val());
			if($("input:not([value])").length==0) {
				checkTable();
			}
			animationHandler($(this));
		}

		
	});

	//INPUT THAT CAN BE MODIFIED BUT ALREADY HAS A VALUE
	$(".dad-board").on("change", "input.with-value", function(){

		if($(this).val() === '' || $(this).val() < 1 || $(this).val() > 9 || $(this).val().length > 1)
		{
			$(this).val("").removeAttr("value").removeClass("with-value");	
		}
		else{
			$(this).attr("value", $(this).val());
			if($("input:not([value])").length==0) {
				checkTable();
			}
			animationHandler($(this));
		}

			$('input.individual-conflict').removeClass("individual-conflict");
	});


	//REMOVE INDIVIDUAL HIGHLIGHT WHEN CHANGE TO EMPTY
	$(".dad-board").on("change", "input.individual-highlight", function(){
		if($(this).val() === '')
		{
			$(this).removeClass("individual-highlight");
		}
	})

	 // ADD INDIVIDUAL HIGHLIGHT
	 $(".dad-board").on("dblclick", 'input.with-value:not(.individual-highlight)', function(){
	 	$(this).addClass("individual-highlight");
	 	var id = setTimeout(function(){ $(this).removeClass("individual-highlight"); }, 5000);
	 	currentTimeouts.push(id);
	 });

	// REMOVE INDIVIDUAL HIGHLIGHT
	$(".dad-board").on("dblclick", "input.individual-highlight", function(){
		$(this).removeClass("individual-highlight");
	})

	//REMOVE GROUP HIGHLIGHT ON INPUT WHEN CHANGED TO EMPTY
	$(".dad-board").on("change", "input.highlight", function(){
		if($(this).val() === "")
			$(this).removeClass("highlight");
	})


	//HIGHLIGHT INPUTS WITH CERTAIN VALUE WHEN BUTTON IS CLICKED
	$("#highlightButtons :button").on("click", function(){
		$("input.highlight").removeClass("highlight");
		var number = $(this).val();
		var found = $(".dad-board").find("input[value="+number+"]").addClass("highlight");
		var id = setTimeout(function(){ found.removeClass("highlight"); }, 5000);
		currentTimeouts.push(id);
	});
	
	//Timers 

	var timer = function(){

		var gameMilis = new Date() - initialTime;
		gameMilis /= 1000;
		var seconds = Math.floor(gameMilis % 60);
		gameMilis /= 60;
		var minutes = Math.floor(gameMilis % 60);
		gameMilis /= 60;
		var hours = Math.floor(gameMilis % 24);
		$("#time").text("Time: "+hours+" : "+minutes+" : "+seconds);
	}

	var stopTimeouts = function(){
		for(var i = 0; i < currentTimeouts.length; i++)
		{	
			clearTimeout(currentTimeouts[i]);
		}

		currentTimeouts = [];
	}

	//Animations Section

	var checkForSquareAnimation = function(input){

		var sline = Math.floor(input.attr("data-line") / 3);
		var scol = Math.floor(input.attr("data-column") / 3);

		var lineFirstElem = sline * 3;
		var colFirstElem = scol * 3;

		var valuesArray = [];
		var cellsArray = [];

		for(var i = lineFirstElem; i < lineFirstElem + 3; i++)
		{	
			for(var j = colFirstElem; j < colFirstElem + 3; j++)
			{	
				var input = $("input[data-column="+j+"][data-line="+i+"]");
				if(input.val() != "" && $.inArray(input.val(), valuesArray) == -1)
				{
					valuesArray.push(input.val());
					cellsArray.push(input.get());
				}
				else{
					return;
				}
			}
		}
		animationsToDo.push(cellsArray);
	}

	var checkForLineAnimation = function(input)
	{	
		var valuesArray = [];
		var lineInputs = $("input[data-line="+input.attr("data-line")+"]");

		for(var i = 0; i < lineInputs.length; i++)
		{
			if(lineInputs.eq(i).val() != "" && $.inArray(lineInputs.eq(i).val(), valuesArray) == -1)
			{
				valuesArray.push(lineInputs.eq(i).val());
			}
			else{
				return null;
			}
		}
		animationsToDo.push(lineInputs);
	}

	var checkForColumnAnimation = function(input)
	{
		var valuesArray = [];
		var colInputs = $("input[data-column="+input.attr("data-column")+"]");
		for(var i = 0; i < colInputs.length; i++)
		{
			if(colInputs.eq(i).val() != "" && $.inArray(colInputs.eq(i).val(), valuesArray) == -1)
			{
				valuesArray.push(colInputs.eq(i).val());
			}
			else{
				return null;
			}
		}
		animationsToDo.push(colInputs);
	}


	var makeAnimation = function(){

		if(!animationRunning && animationsToDo.length > 0)
		{
			animationRunning = true;
			var time = 55;
			var array = animationsToDo.shift();

			$(array).each(function(index) {
				var cell = $(this);
				var cell = $(this).parent();
				if(index == array.length - 1)
				{	
            		//on the last one, we call the function again, to do the following animation
            		$(cell).delay(time+=55).animate({backgroundColor: "#FF8C00"}, 550).delay(200).animate({backgroundColor: "#FFFFFF"},{duration:500, done: update});
            	}
            	else {
            		//1 - 7 index, where we only need to do the animation.
            		$(cell).delay(time+=55).animate({backgroundColor: "#FF8C00"}, 550).delay(200).animate({backgroundColor: "#FFFFFF"}, 550);
            	}
            });           
		}
	}

	var update = function (){
		animationRunning = false;
		if(animationsToDo.length > 0){
			makeAnimation();
		}
	}

	var animationHandler = function (input)
	{
		checkForLineAnimation(input);
		checkForColumnAnimation(input);
		checkForSquareAnimation(input);		
		makeAnimation();
	}

	var showMessageFinish = function(){
		$('#message').text("Game Won, congratulations!!");
		timer();
		$("#dialog").dialog({
			modal: true,
			buttons:{
				Ok: function(){
					$(this).dialog("close");
					clearTable();
					requestBoard();
				}
			}
		});
	}

	init();

})();


