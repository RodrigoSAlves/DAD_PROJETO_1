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


	var requestBoard = function()
	{
		var option = $("#select-mode option:selected").val();

		$.get( "http://198.211.118.123:8080/board/", {option} )
			.done(function(data) {
				populateInitialTable(data);
				$("#loading").addClass("invisible");
			});
	}	



	var populateInitialTable = function(data){

		//put clear here
		$("input").val('');
		$("input").removeAttr("value");
		$("input").attr("value", "3");

		for(var i = 0; i < data.length; i++)
		{	
			$("input[data-column="+data[i].column+"][data-line="+data[i].line+"]")
			//.attr("value", data[i].value);
			.val(data[i].value);
			
			$("input[data-column="+data[i].column+"][data-line="+data[i].line+"]")
			.addClass("initial")
			.attr("disabled", true);
			
			
			if(1);
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

	//TODO Generate a new game
	$("#btn-new").click(function() {
		event.preventDefault();
		$("#loading").removeClass("invisible");

		$('input.with-value')
		.removeAttr("value")
		.removeClass('with-value');

		$('input:disabled.initial')
		.removeAttr("value")
		.removeAttr("disabled")
		.removeClass("initial");
		
		requestBoard();
	});


	//ERROR
	
	
	/*$("input").on("change", function() {
		if($(this).hasClass("with-value")) {
			$(this).removeClass("with-value");
		} else {
			$(this).addClass("with-value");
			$(this).attr("value", $(this).val());
		}
	})*/

	// COMPLETE Add value attribute when changed
	$("input:empty").on("change", function() {
		$(this).addClass("with-value");
		$(this).attr("value", $(this).val());
		$('input.with-value').change(function() {
			console.log("teste");
		})
	})


	//TODO
	// Individual HighLight by double clicking
	/*$(".with-value").on("click", function(){
		console.log("teste");
	})*/

	/*$(".with-value").on("focusout", function(){
		$(this).removeClass("individual-highlight");
	})*/


	// COMPLETE: Highlight a specific number for 5 seconds
	$("#highlightButtons :button").on("click", function(){
		var number = $(this).val();
		var found = $(".dad-board").find(":input[value="+number+"]").addClass("highlight");
		setTimeout(function(){ found.removeClass("highlight"); }, 5000);
		

	});


	init();


})();

