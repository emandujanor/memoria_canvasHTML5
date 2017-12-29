/**VARIABLES***/
var ctx;
const canvas = document.getElementById("miCanvas");
var primerCarta = true;
var cartaPrimera, cartaSegunda;
var colorDelante = "yellow";
var colorAtras = "blue";
var colorCanvas = "green";
var inicioX = 45;
var inicioY = 50;
var cartaMargen = 30;
var cartaLon = 30;
var cartaAncho = cartaLon * 4;
var cartaLargo = cartaLon * 4;
var cartas_array = new Array();
var iguales = false;
var cartas = 0;




/***FUNCIONES****/
//Crea el objeto Carta
function Carta(x, y, ancho, largo, info){
  this.x = x;
  this.y = y;
  this.ancho = ancho;
  this.largo = largo;
  this.info = info;
  this.dibuja = dibujaCarta;
}
function dibujaCarta(){
  ctx.fillStyle = colorAtras;
  ctx.fillRect(this.x, this.y, this.ancho, this.largo);
}
function tablero(){
 var i;
 var carta;
 var x = inicioX;
 var y = inicioY;
 for(i = 0; i < 6; i++){
  carta = new Carta(x, y, cartaAncho, cartaLargo, i);
  cartas_array.push(carta);
  carta.dibuja();
  //Creamos la segunda carta
  carta = new Carta(x, y + cartaAncho + cartaMargen, cartaAncho, cartaLargo, i);
  cartas_array.push(carta);
  carta.dibuja();
  //Aumentamos el valor de x
  x += cartaAncho + cartaMargen;
 }

}
/*intercambia las cartas de lugar*/
function barajear(){
  var i, j, k;
  var temporal;
  var lon = cartas_array.length;
  for(j=0; j<lon*3; j++){
    i = Math.floor(Math.random()*lon);
    k = Math.floor(Math.random()*lon);
    //
    temporal = cartas_array[i].info;
    //
    cartas_array[i].info = cartas_array[k].info;
    cartas_array[k].info = temporal;

  }
}
/*Nos da las coordenadas exactas que fueron cliqueadas*/
function ajusta(xx, yy){
var posCanvas = canvas.getBoundingClientRect();/*nos da las coordenadas absolutas del canvas, largo y alto que fue clickeado*/
var x = xx -posCanvas.left;//nos da la posicion x y y con repecto a la posicion original del canvas
var y = yy -posCanvas.top;
return {x:x, y:y}
}

function selecciona(e){
  var pos = ajusta(e.clientX, e.clientY);
  //alert(pos.x+", "+pos.y);
  for(var i=0; i<cartas_array.length; i++){//vamos a recorrer todas las cartas
    var carta = cartas_array[i]; //e objeto temporal que guarda cada una de las cartas
    //si la carta no ha sido seleccionada
    if(carta.x > 0){
      //valida que se haya clickeado dentro de cualguera de las cartas
      if((pos.x > carta.x) &&( pos.x < carta.x + carta.ancho)&& (pos.y > carta.y) &&( pos.y < carta.y + carta.largo) ){
        //si le da click dos veces a la misma carta no lo consideramos
         if((primerCarta)||(i!= cartaPrimera)) break;
      }

    }

  }
  // Encontramos la carta
  if(i < cartas_array.length){
    //alert(i); //nos da el indice de la carta del arreglo  que fue cliqueada
    if(primerCarta){
      cartaPrimera = i;
      //alert(cartaPrimera);
      primerCarta = false;
      pinta(carta);
    }else{
      cartaSegunda = i;
      pinta(carta);
      primerCarta = true;
      //si son iguales
      if(cartas_array[cartaPrimera].info==cartas_array[cartaSegunda].info){
        iguales=true;
        cartas++;
        aciertos();

      }else{
        iguales=false;

      }

    setTimeout(volteaCarta, 1000);
    }
  }

}

function volteaCarta(){
  if(iguales==false){
    cartas_array[cartaPrimera].dibuja();
    cartas_array[cartaSegunda].dibuja();
  }else{//Eliminamos las cartas
    ctx.clearRect(cartas_array[cartaPrimera].x, cartas_array[cartaPrimera].y, cartas_array[cartaPrimera].ancho, cartas_array[cartaPrimera].largo);
    ctx.clearRect(cartas_array[cartaSegunda].x, cartas_array[cartaSegunda].y, cartas_array[cartaSegunda].ancho, cartas_array[cartaSegunda].largo);
    cartas_array[cartaPrimera].x = -1;
    cartas_array[cartaSegunda].x = -1;

  }


}
//Dibuja la carta, darle la vuelta
function pinta(carta){//carta es el indice dentro de nuestro arreglo
  ctx.fillStyle = colorDelante;
ctx.fillRect(carta.x, carta.y, carta.ancho, carta.largo);
ctx.font = "bold 40px Comic";
ctx.fillStyle = "black";
ctx.fillText(String(carta.info), carta.x+carta.ancho/2-10, carta.y + carta.largo/2+10);

}
function aciertos(){
  ctx.save();
ctx.fillStyle ="black";
if( cartas==6){
   ctx.clearRect(0,0, canvas.width, canvas.height);
   ctx.font = "bold 80px Comic";
   ctx.restore();
   ctx.fillText("Muy bien, eres un genio", 90, 220);

} else{
  ctx.clearRect(0,340, canvas.width/2, 100);
  ctx.font = "bold 40px Comic";
  ctx.fillText("Aciertos: "+ String(cartas), 30, 380);
  ctx.restore();
}


}
/* INICIO*/
window.onload = () => {

  if(canvas && canvas.getContext)  {
    ctx = canvas.getContext("2d");
    console.log(canvas, ctx);
    if(ctx){
      canvas.addEventListener("click", selecciona, false);
      tablero();
      barajear();
      aciertos();
    } else {
      alert("Error al crear tu contexto");
    }
  }
}
