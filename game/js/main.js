// 2140000- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:

(function() {
	'use strict';
	//function definition

	var initialTime;
	var currentTimeouts = [];

	var init = function()
	{	
		fillStudentInfo();
		requestBoard();
		$("input:not(.initial)").attr("min", 0).attr("max", 9);
	}

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
				$("#loading").addClass("invisible");
				for(var i = 0; i < data.conflicts.length; i++)
				{	
					$("input[data-column="+data.conflicts[i].column+"][data-line="+data.conflicts[i].line+"]")
					.addClass("individual-conflict");
				}
				var id = setTimeout(function(){ $("input.individual-conflict").removeClass("individual-conflict"); }, 5000);
				currentTimeouts.push(id);
			}
		});
	}


	var requestBoard = function()
	{
		var option = $("#select-mode option:selected").val();

		$.get( "http://198.211.118.123:8080/board/"+option)
		.done(function(data) {
			populateInitialTable(data);
			$("#loading").addClass("invisible");
		})
		.fail(function () {
			console.log("Something went wrong");
		});
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

	//Botão de novo jogo
	$("#btn-new").click(function() {
		event.preventDefault();
		$("#loading").removeClass("invisible");
		clearTable();
		requestBoard();
	});

	$("#btn-check").click(function() {
		$("#loading").removeClass("invisible");
		checkTable();
	})

	
	var clearTable = function () {
		$(".with-value").val('').removeAttr("value").removeClass("with-value");

		$("input:disabled.initial").removeAttr("disabled").val('').removeAttr("value").removeClass("initial");

		$(".highlight").removeClass("highlight");

		$(".individual-highlight").removeClass("individual-highlight");

		$(".individual-conflict").removeClass("individual-conflict");

		if(currentTimeouts.length !=0 )

			stopTimeouts();
	}

	//[7] EXCEPTION: html type="number" accepts numbers as well as "e"
	// To solve this exception we need to use keyup as onchange doesn't work
	$("input:not(.initial)").on("keyup", function(event){
		if(event.key == "e"){
			$(this).val("");
		}
	});


	//Input :not(.initial) handler.
	$(".dad-board").on("change", "input:not(.initial)", function(){

		$("input.individual-conflict").removeClass("individual-conflict");

		if($(this).val() === '')
		{
			$(this).removeClass("with-value");
			$(this).removeAttr("value");
		}
		else{
			if(!($(this).val() < 0 || $(this).val() > 9 || $(this).val().length > 1))
			{
				$(this).addClass("with-value");
				$(this).attr("value", $(this).val());
			}
		}
	});

	var verify = function () {
		var values=[];
		var numbers;
		var object={};
		for (var i = 0; i < 9; i++) {
			for(var j = 0 ; j < 9 ; j++) {
				values[j]=($("input[data-column="+j+"][data-line="+i+"]").val());
			}
			numbers=0;
			for (var v = 1; v < 10; v++) {
				if($.inArray(""+v, values)!=-1) {
					numbers++;
				}
			}
			var k=0;

			if(numbers == 9) {
				$("input[data-line="+i+"]").parent().each( function(){
					$(this).animate({backgroundColor: "#FF8C00"}, 1000)
						.delay(2000).animate({backgroundColor: "#FFFFFF"}, 1000).delay(1000);				
					k++;

				})
			}
		}
		
	}


	$(".dad-board").on("dblclick", 'input.with-value', function(){
		$(this).addClass("individual-highlight");
		var id = setTimeout(function(){ $(this).removeClass("individual-highlight"); }, 5000);
		currentTimeouts.push(id);
	});

	// [4] HIGHLIGHT BUTTONS
	$("#highlightButtons :button").on("click", function(){
		$("input.highlight").removeClass("highlight");
		var number = $(this).val();
		var found = $(".dad-board").find("input[value="+number+"]").addClass("highlight");
		var id = setTimeout(function(){ found.removeClass("highlight"); }, 5000);
		currentTimeouts.push(id);
	});

	var timer = function(){

		var gameMilis = new Date() - initialTime;
		gameMilis /= 1000;
		var seconds = Math.round(gameMilis % 60);
		gameMilis /= 60;
		var minutes = Math.round(gameMilis % 60);
		gameMilis /= 60;
		var hours = Math.round(gameMilis % 24);

	}

	var stopTimeouts = function(){
		for(var i = 0; i < currentTimeouts.length; i++)
		{	
			clearTimeout(currentTimeouts[i]);
		}
		currentTimeouts = [];
	}

	var animateSquare = function(input){

		var sline = Math.ceil(input.attr("data-line") / 3);
		var scol = Math.ceil(input.attr("data-column") /3);

		var firstElemLine = (sline - 1) * 3;
		var firstElemCol = (scol - 1) * 3;

		for(var i = sline; i < sline + 3; i++)
		{
			for(var j = scol; j < scol + 3; j++)
			{

			}
		}

	}


	init();


})();