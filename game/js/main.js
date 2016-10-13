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

		for (var i = 0; i < 9 ; i++) {
			for (var j = 0; j < 9 ; j++) {
				if ($("input[data-column="+j+"][data-line="+i+"]").val()!=0) {
					board.push({"line":i,"column":j,"value":""+$("input[data-column="+j+"][data-line="+i+"]").val(),"fixed":($("input[data-column="+j+"][data-line="+i+"]").prop("disabled")?true:false)});
				}
			}
		}

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
				console.log("fail")
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

	//Limpar tabela
	var clearTable = function () {
		$("input.with-value")
		.val('')
		.removeAttr("value")
		.removeClass("with-value")

		$("input:disabled.initial")
		.removeAttr("disabled")
		.val('')
		.removeAttr("value")
		.removeClass("initial")

		$("input.highlight").removeClass("highlight");
		$("input.individual-highlight").removeClass("individual-highlight");
		$("input.individual-conflict").removeClass("individual-conflict");
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


	//[7] ADD CLASS WITH VALUE
	
	$("input:not(.initial)").on("change", function () {
		$("input.individual-conflict").removeClass("individual-conflict");
		
		if(!($(this).val() < 0 || $(this).val() > 9 || $(this).val().length > 1)){
			$(this).addClass("with-value");
			$(this).attr("value", $(this).val());
			timer();
		}
		else{
			$(this).val("");
		}

		//[8] REMOVE CLASS WITH-VALUE
		$("input.with-value").on("change", function() {
			if($(this).val() === '') {
				$(this).removeClass("with-value");
			}

		})

		// Por algum motivo depois de preencher um campo e em seguida limpa-lo este continua a ser possivel fazer highligh!!!
		$("input.with-value").on("dblclick", function(){
			var input = $(this).addClass("individual-highlight");
			var id = setTimeout(function(){ input.removeClass("individual-highlight"); }, 5000);
			currentTimeouts.push(id);
		})
		
		//verify();
	});

	var verify = function () {
		//$(".dad-row .dad-cell").css("background", "orange");
	}
	

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

		console.log("seconds " + seconds + " minutes " + minutes + " hours " + hours);

	}

	var stopTimeouts = function(){
		for(var i = 0; i < currentTimeouts.length; i++)
		{	
			clearTimeout(currentTimeouts[i]);
		}
		currentTimeouts = [];
	}


	init();


})();