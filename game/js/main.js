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


	$("input").on("change", function () {
		$(this).addClass("with-value");
		$(this).attr("value", $(this).val());	
		$("input.with-value").on("change", function() {
			//$(this).removeClass("with-value");
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