window.onload = function(){
	start();
}

var key = {
	space: 32,
	activo: false
}

var images = {
	bg: new Image(),
	woppy: new Image(),
	woppymuerto: new Image(),
	piso: new Image(),
	tubos: new Image(),
	woppymuertoCargado: false,
	bgCargado: false,
	woppyCargado: false,
	pisoCargado: false,
	tubosCargado: false,
}

var srcs = {
	bgsrc: "img/fondo.png",
	woppysrc: "img/woppy.png",
	woppymuertosrc: "img/woppymuerto.png",
	pisosrc: "img/piso.png",
	tubossrc: "img/tubos.png"
}

var personaje = function(){
	this.alto = 200;
	this.gravedad = 0.1;
	this.vivo = true;
	this.salto = 0;
	this.aceleracion = 0.4;
	this.posx = 100;
	this.entre = false;
}

var tubos = function(){
	this.Xmax;
	this.Xmin;
	this.aparece;
	this.desaparece;
	this.alto;
	this.posx;
	this.posy;
}

var juego = function(){
	this.estado = 1;
	this.maximo = 0;
	this.actual = 0;

	// 1 no iniciado // 2 en juego // 3 perdido;
}

var partida = new juego();
partida.estado = 1;

function generarAlto(){
	max = 280;
	min= 110;
	var alto = Math.floor((Math.random()*(max-min+1))+min);
	alto *= -1;
	return alto;
}

function verAlto(tubo){
	alto= tubo.alto + 310;
	return alto;
}

var canvas;
var ctx;
var woppy = new personaje();


function start(){
	canvas = document.getElementById("micanvas");
	canvas.width = 500;
	canvas.height = 500;
	ctx = canvas.getContext("2d");
	images.bg.src = srcs.bgsrc;
	images.piso.src = srcs.pisosrc;
	images.woppy.src = srcs.woppysrc;
	images.woppymuerto.src = srcs.woppymuertosrc;
	images.tubos.src = srcs.tubossrc;
	images.bg.onload = function(){
		images.bgCargado = true;
		dibujar();
	}
	images.piso.onload = function(){
		images.pisoCargado = true;
		dibujar();
	}
	images.woppy.onload = function(){
		images.woppyCargado = true;
		dibujar();
	}
	images.tubos.onload = function(){
		images.tubosCargado = true;
		dibujar();
	}
	images.woppymuerto.onload = function(){
		images.woppymuertoCargado = true;
		dibujar();
	}

}

var contador = 0;

var tubo = new Array(3);
for (var i = tubo.length - 1; i >= 0; i--) {
	tubo[i] = new tubos();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


function dibujar(){
	if (images.bgCargado) {
		ctx.drawImage(images.bg,0,0);		
	};

	if (images.tubosCargado) {
		animarTubos()
	};

	if (images.woppyCargado){
		animarWoppy();
	};

	if (images.pisoCargado) {
		ctx.drawImage(images.piso,0,420);	
	};

	if (partida.estado == 1) {

	};

	ctx.font = " bold 60px Neue";
	ctx.fillStyle = "#353535";
	ctx.fillText(partida.actual, 248, 50);

	ctx.font = " normal 18px Helvetica Neue";
	ctx.fillText("Por: @MorenoDaryl ", 340, 490);

	ctx.font = " normal 18px Helvetica Neue";
	ctx.fillText("Record: " + partida.maximo, 10, 490);

	requestAnimFrame(dibujar);

};


function animarTubos(){
	var espacio = 300;

	for (var i = tubo.length - 1; i >= 0; i--) {
		if (tubo[i].alto==undefined){ // si no ha iniciado se inicia
			tubo[i].alto = generarAlto(); // se genera una alto random
			tubo[i].posx = (i*espacio)+510; //510 es el ancho del canvas
		}
		if (tubo[i].posx < -80) { // si pasa el canvas el tubo se reiniciar su posicion
			if(i-1 < 0){ // si al restar un tubo da -1
				tubo[i].posx = tubo[2].posx + espacio; // se agarra la posicion del tubo 2
			}
			else{ // si no solo se le resta uno a la posicion actual
				tubo[i].posx = tubo[i-1].posx + espacio; 
			}
			// si no, si la posicion del tubo esta entre la posicion del woppy cuando pasa por el
			//                 + 5 representa un que tiene 5px de ventaja 
		}else if((tubo[i].posx + 5 > woppy.posx & tubo[i].posx< woppy.posx + images.woppy.width - 5) || (tubo[i].posx + images.tubos.width > woppy.posx & tubo[i].posx + images.tubos.width < woppy.posx + images.woppy.width) ){
			
			if (woppy.alto < verAlto(tubo[i])) { // si cuando wopy esta pasando por los tubos y choca con la parte superior
				//perdio :s
				woppy.vivo = false; // muerto
			}else if(woppy.alto + images.woppy.height > verAlto(tubo[i]) + 143){ // si woppy toca por la parte inferior del tuvo pierde
				woppy.vivo = false;
			}
			else{
				woppy.entre = true;
			}
		}
		else if(tubo[i].posx < 100 - images.woppy.width && woppy.entre){ // si pasa el tubo se agrega 1 mas a la actual
			partida.actual++;
			if (partida.actual > partida.maximo) {
				partida.maximo = partida.actual;
			};
			woppy.entre = false;
		}
		
	};
	var aceleracion = 0.6;
	if (woppy.vivo & partida.estado == 2) {
		tubo[0].posx -= aceleracion;
		tubo[1].posx -= aceleracion;
		tubo[2].posx -= aceleracion;
	};
	// tubo[2].posx -= aceleracion;
	ctx.drawImage(images.tubos,tubo[0].posx,tubo[0].alto);
	ctx.drawImage(images.tubos,tubo[1].posx,tubo[1].alto);
	ctx.drawImage(images.tubos,tubo[2].posx,tubo[2].alto);
}

function animarWoppy(){
	var aceleracion = 0.02;
	var maxAceleracion = 2.5  ;
	var arriba;
	if(images.woppymuertoCargado && partida.estado == 1){
		ctx.drawImage(images.woppy,woppy.posx,woppy.alto);

		if (woppy.alto > 200 && !arriba) {
			woppy.aceleracion -= 0.002;
		}else{
			arriba = true;
		}

		if (woppy.alto < 400 && arriba) {
			woppy.aceleracion += 0.002;
		}else{
			arriba = false;
		}

		woppy.alto += woppy.aceleracion;
	}
	if(images.woppymuertoCargado && partida.estado == 2) {
		
		
		if (woppy.alto <= 420-images.woppy.height){
			ctx.drawImage(images.woppy,woppy.posx,woppy.alto);

			if (woppy.aceleracion < maxAceleracion) {
				woppy.aceleracion += aceleracion  ;
			}else{
				woppy.aceleracion = maxAceleracion;
			}

			if(key.activo){
				key.activo = false;
				woppy.aceleracion = 1.72 *-1;  
			}
			
			if (woppy.alto + woppy.aceleracion > 0) {
				woppy.alto += woppy.aceleracion;	
			};
			
		}
		else{
			woppy.vivo = false;
			partida.estado = 3;
		}
		if (!woppy.vivo){
			ctx.drawImage(images.woppymuerto,woppy.posx,woppy.alto);
		}
	}

	if (partida.estado==3) {
		ctx.drawImage(images.woppymuerto,woppy.posx,woppy.alto);
	};

}

document.addEventListener("keydown",function(e){

	if (e.keyCode == key.space) {
		if (partida.estado ==1) {
			partida.estado = 2;
		};
		if (partida.estado == 2 & woppy.vivo) {
			key.activo = true;
		};
		
	}; 
	e.preventDefault();
	resetear();
});

document.addEventListener("touchstart",function(e){
	if (partida.estado ==1) {
		partida.estado = 2;
	};
	if (partida.estado == 2 & woppy.vivo) {
		key.activo = true;
	};	
	e.preventDefault();
	resetear();
});

document.addEventListener("mousedown",function(e){
	if (partida.estado ==1) {
		partida.estado = 2;
	};
	if (partida.estado == 2 & woppy.vivo) {
		key.activo = true;
	};	
	e.preventDefault();
	resetear();
});

function resetear(){
	if (!woppy.vivo && partida.estado==3) {
		partida.estado = 1;
		partida.actual = 0;
		woppy.vivo = true;
		for (var i = tubo.length - 1; i >= 0; i--) {
			tubo[i].alto = undefined;
		};
		woppy = new personaje();
	};

}
