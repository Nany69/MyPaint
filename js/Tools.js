'use strict'

$(document).ready(function() {
	
	// Variables :
	var geo = false;
	var color = "#000";
	var painting = false;
	var started = false;
	var width_brush = 5;
	var canvas = $("#canvas");
	var cursorX, cursorY;
	var restoreCanvasArray = [];
	var restoreCanvasIndex = 0;
	var x1 = 0;
	var y1 = 0;
	var firstClick = true;
	
	var context = canvas[0].getContext('2d');

	// Trait arrondi :
	context.lineJoin = 'round';
	context.lineCap = 'round';
	
	// Click souris enfoncé sur le canvas, je dessine :
	canvas.mousedown(function(e) {
		painting = true;
		
		// Coordonnées de la souris :
		cursorX = (e.pageX - this.offsetLeft);
		cursorY = (e.pageY - this.offsetTop);
	});
	
	// Relachement du Click sur tout le document, j'arrête de dessiner :
	$(this).mouseup(function() {
		painting = false;
		started = false;
	});
	
	// Mouvement de la souris sur le canvas :
	canvas.mousemove(function(e) {
		// Si je suis en train de dessiner (click souris enfoncé) :
		if (painting) {
			// Set Coordonnées de la souris :
			cursorX = (e.pageX - this.offsetLeft) - 10; // 10 = décalage du curseur
			cursorY = (e.pageY - this.offsetTop) - 10;
			
			// Dessine une ligne :
			drawLine();
		}
	});

	$('#ligne').on('click', function(event){
		geo = "line";
	});

	$('#rect').on('click', function(event){
		geo = "rect";
	});

	$('#cercle').on('click', function(event){
		geo = 'cercle';
	});

	$('#canvas').on('mousedown', function(event){
		cursorX = (event.pageX - this.offsetLeft);
		cursorY = (event.pageY - this.offsetTop);

		if (firstClick) {
			x1 = cursorX;
			y1 = cursorY;
			firstClick = false;
		}else {
			drawGeometry(x1, y1, cursorX, cursorY, geo);
			geo = false;
			firstClick = true;
		}
	});

	function drawGeometry(x1, y1, x2, y2, type) {
		var radius;
		var angle;

		switch(type){
			case 'line' :
				context.beginPath();
				context.fillStyle = color;
				context.strokeStyle = color;
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
				context.stroke();
				context.closePath();
			break;

			case 'rect' :
				context.beginPath();
				context.fillStyle = color;
				context.strokeStyle = color;
				context.fillRect(x1, y1, x2-x1, y2-y1);
				context.closePath();
			break;

			case 'cercle' :
				radius = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
				if (radius < 0) {
					radius = radius*(-1);
				}
				context.beginPath();
				context.fillStyle = color;
				context.strokeStyle = color;
				context.arc(x1, y1, radius, 0*Math.PI, 2*Math.PI);
				context.fill();
				context.closePath();
			break;
		}
	}
	
	// Fonction qui dessine une ligne :
	function drawLine() {
		// Si c'est le début, j'initialise
		if (!started) {
			// Je place mon curseur pour la première fois :
			context.beginPath();
			context.moveTo(cursorX, cursorY);
			started = true;
		} 
		// Sinon je dessine
		else {
			context.lineTo(cursorX, cursorY);
			context.strokeStyle = color;
			context.lineWidth = width_brush;
			context.stroke();
		}
	}
	
	// Clear du Canvas :
	function clear_canvas() {
		context.clearRect(0,0, canvas.width(), canvas.height());
	}
	
	// Pour chaque carré de couleur :
	$("#couleurs a").each(function() {
		// Je lui attribut une couleur de fond :
		$(this).css("background", $(this).attr("data-couleur"));
		
		// Et au click :
		$(this).click(function() {
			// Je change la couleur du pinceau :
			color = $(this).attr("data-couleur");
			
			// Et les classes CSS :
			$("#couleurs a").removeAttr("class", "");
			$(this).attr("class", "actif");
			
			return false;
		});
	});

	$("#gomme").each(function() {
		// Je lui attribut une couleur de fond :
		$(this).css("background", $(this).attr("data-couleur"));
		
		// Et au click :
		$(this).click(function() {
			// Je change la couleur du pinceau :
			color = $(this).attr("data-couleur");
			
			// // Et les classes CSS :
			// $("#gomme").removeAttr("class", "");
			// $(this).attr("class", "actif");
			
			return false;
		});
	});
	
	// Largeur du pinceau :
	$("#largeurs_pinceau input").change(function() {
		if (!isNaN($(this).val())) {
			width_brush = $(this).val();
			$("#output").html($(this).val() + " pixels");
		}
	});
	
	// Bouton Reset :
	$("#reset").click(function() {
		// Clear canvas :
		clear_canvas();
		
		// Valeurs par défaut :
		$("#largeur_pinceau").attr("value", 5);
		width_brush = 5;
		$("#output").html("5 pixels");
		
	});
	
	// Bouton Save :
	$("#save").click(function() {
		var canvas_tmp = document.getElementById("canvas");
		window.location = canvas_tmp.toDataURL("image/png");
	});
	
});


// var clicks = 0;
// var lastClick = [0, 0];

// document.getElementById('canvas').addEventListener('click', line, false);

// function getCursorPosition(e) {
//     var x;
//     var y;

//     if (e.pageX != undefined && e.pageY != undefined) {
//         x = e.pageX;
//         y = e.pageY;
//     } else {
//         x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
//         y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
//     }
    
//     return [x, y];
// }

// function line(e) {
//     context = this.getContext('2d');

//     x = getCursorPosition(e)[0] - this.offsetLeft;
//     y = getCursorPosition(e)[1] - this.offsetTop;
    
//     if (clicks != 1) {
//         clicks++;
//     } else {
//         context.beginPath();
//         context.moveTo(lastClick[0], lastClick[1]);
//         context.lineTo(x, y, 6);
        
//         context.strokeStyle = '#000000';
//         context.stroke();
        
//         clicks = 0;
//     }
    
//     lastClick = [x, y];
// };