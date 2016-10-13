// 2140000- Student name 1
// 2140001- Student name 2
// 2140002- Student name 3

// Implementation:

(function() {
	'use strict';
	//function definition

	var init = function()
	{	
		fillStudentInfo();
		requestBoard();
		$("input:not(.initial)").attr("min", 0).attr("max", 9);
	}

	var checkTable = function() {  
		var board=[];
		
		for (var i = 0; i < 8 ; i++) {
			for (var j = 0; j < 8 ; j++) {
				if ($("input[data-column="+j+"][data-line="+i+"]").val()!=0) {
					board.push({"line":i,"column":j,"value":$("input[data-column="+j+"][data-line="+i+"]").val(),"fixed":($("input[data-column="+j+"][data-line="+i+"]").prop("disabled")?true:false)});
				}
			}
		}
		$.post("http://198.211.118.123:8080/board/check", {board});
	}

	var requestBoard = function()
	{
		var option = $("#select-mode option:selected").val();

		$.get( "http://198.211.118.123:8080/board/"+option)
			.done(function(data) {
				populateInitialTable(data);
				$("#loading").addClass("invisible");
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
		checkTable();
	})

	//Limpar tabela
	var clearTable = function () {
		$("input.with-value")
		.val('')
		.removeAttr("value")
		.removeClass("with-value")
		.removeClass("individual-highlight")
		.removeClass("highlight");

		$("input:disabled.initial")
		.removeAttr("disabled")
		.val('')
		.removeAttr("value")
		.removeClass("initial")
		.removeClass("individual-highlight")
		.removeClass("highlight");
	}

	//[7] EXCEPTION: html type="number" accepts numbers as well as "e"
	// To solve this exception we need to use keyup as onchange doesn't work
	$("input:not(.initial)").on("keyup", function(event){
		if(event.key == "e"){
			$(this).val("");
		}
	});

	//[7]add class with value
	$("input:not(.initial)").on("change", function () {
		if(!($(this).val() < 0 || $(this).val() > 9 || $(this).val().length > 1)){
			$(this).addClass("with-value");
			$(this).attr("value", $(this).val());
		}
		else{
			$(this).val("");
		}
		//[8] REMOVE CLASS WITH-VALUE
		$("input.with-value").on("change", function() {
			if($(this).val() === '')
				$(this).removeClass("with-value");
		})

		$("input.with-value").on("dblclick", function(){
			$(this).addClass("individual-highlight");
			setTimeout(function(){ 
				$("input.with-value").removeClass("individual-highlight"); 
			}, 5000);
		})
	});

	// Highlight a specific number for 5 seconds
	$("#highlightButtons :button").on("click", function(){
		$(".dad-board").find("input.highlight").removeClass("highlight");
		var number = $(this).val();
		var found = $(".dad-board").find("input[value="+number+"]").addClass("highlight");
		var timeout = setTimeout(function(){ found.removeClass("highlight"); }, 5000);
	});

	init();


})();