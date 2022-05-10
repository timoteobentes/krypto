function start() {
    $("#inicio").hide();
    
    $("#fundoGame").append("<div id='jogador'></div>");
    $("#fundoGame").append("<div id='lex'></div>");
    $("#fundoGame").append("<div id='carro'></div>");
    $("#fundoGame").append("<div id='civil' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='vidas'></div>");

    // Principais variáveis do jogo

    var vidaAtual = 5;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var fimdeJogo = false;
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var jogo = {}
    var TECLA = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        ENTER: 13 
    }

    jogo.pressionou = [];

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    // Música em loop

    musica.addEventListener("ended", function(){musica.currentTime = 0;
    musica.play(); }, false);
    musica.play();

    // Game loop

    jogo.timer = setInterval(loop, 30);

    function loop() {
        moveFundo();
        moveJogador();
        moveLex();
        moveCarro();
        moveCivil();
        colisao();
        placar();
        vidas();
    }

    // Função que movimenta o fundo do jogo

    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 5);
    }

    // Verifica se o usuário pressionou alguma tecla

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    function moveJogador() {
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);
        }

        if(jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);
        }

        if(jogo.pressionou[TECLA.A]) {
            var left = parseInt($("#jogador").css("left"));
            $("#jogador").css("left", left - 10);
        }

        if(jogo.pressionou[TECLA.D]) {
            var left = parseInt($("#jogador").css("left"));
            $("#jogador").css("left", left + 10);
        }

        if(jogo.pressionou[TECLA.ENTER]) {
            // Chama a função DIsparo
            disparo();
        }

        if(topo <= 0) {
            $("#jogador").css("top", topo + 10);
        }

        if(topo >= 434) {
            $("#jogador").css("top", topo - 10);
        }

        if(left <= 0) {
            $("#jogador").css("left", left + 10);
        }

        if(left >= 650) {
            $("#jogador").css("left", left - 10);
        }
    }

    function moveLex() {
        posicaoX = parseInt($("#lex").css("left"));
        $("#lex").css("left", posicaoX - velocidade);
        $("#lex").css("top", posicaoY);

        if(posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#lex").css("left", 694);                 // Quando o lex chegar no outro lado, ele vai sumir e carregar do lado original de novo
            $("#lex").css("top", posicaoY);
        }
    }

    function moveCarro() {
        posicaoX = parseInt($("#carro").css("left"));
        $("#carro").css("left", posicaoX - 3);

        if(posicaoX <= 0) {
            $("#carro").css("left", 625);
        }
    }

    function moveCivil() {
        posicaoX = parseInt($("#civil").css("left"));
        $("#civil").css("left", posicaoX + 1);

        if(posicaoX > 875) {
            $("#civil").css("left", 0);
        }
    }

    function disparo() {

        somDisparo.play();
        if(podeAtirar == true) {
            podeAtirar = false; // Ou seja, não vai poder atirar várias vez, apenas uma vez até que o tiro saia da div

            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 170;    // define a posição de onde sairá o tiro
            topoTiro = topo + 9;
            $("#fundoGame").append("<div id='disparo'></div>"); // cria a div disparo no index.html
            $("#disparo").css("top", topoTiro);  
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);
        }

        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            if(posicaoX > 750) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null; // Se ultrapassar a div, pode atirar de novo
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#lex")));
        var colisao2 = ($("#jogador").collision($("#carro")));
        var colisao3 = ($("#disparo").collision($("#lex")));
        var colisao4 = ($("#disparo").collision($("#carro")));
        var colisao5 = ($("#jogador").collision($("#civil")));
        var colisao6 = ($("#carro").collision($("#civil")));
        // Cada colisão no jogo

        // Jogador com lex
        if(colisao1.length > 0) {

            vidaAtual --;
            lexX = parseInt($("#lex").css("left"));
            lexY = parseInt($("#lex").css("top"));
            explosao1(lexX, lexY);

            posicaoY = parseInt(Math.random() * 334);
            $("#lex").css("left", 694);
            $("#lex").css("top", posicaoY);
        }

        // Jogador com carro
        if(colisao2.length > 0) {

            vidaAtual --;
            carroX = parseInt($("#carro").css("left"));
            carroY = parseInt($("#carro").css("top"));
            explosao2(carroX, carroY);

            $("#carro").remove();

            reposicionaCarro();
        }

        // Disparo contra lex

        if(colisao3.length > 0) {
            velocidade = velocidade + 0.3;
            lexX = parseInt($("#lex").css("left"));
            lexY = parseInt($("#lex").css("top"));

            explosao1(lexX, lexY);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#lex").css("left", 694);
            $("#lex").css("top", posicaoY);
        }

        // Disparo contra carro
        if(colisao4.length > 0) {

            pontos = pontos + 50;
            carroX = parseInt($("#carro").css("left"));
            carroY = parseInt($("#carro").css("top"));
            $("#carro").remove();

            explosao2(carroX, carroY);
            $("#disparo").css("left", 950);

            reposicionaCarro();
        }

        // Jogador pega civil
        if(colisao5.length > 0) {

            somResgate.play();0
            salvos ++;
            reposicionaCivil();
            $("#civil").remove();
        }

        // Carro acerta civil
        if(colisao6.length > 0) {

            perdidos ++;
            civilX = parseInt($("#civil").css("left"));
            civilY = parseInt($("#civil").css("top"));
            explosao3(civilX, civilY);
            $("#civil").remove();

            reposicionaCivil();
        }
    }

    // Explosão 1
    function explosao1(lexX, lexY) {

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url('./assets/img/explosao.png')");

        var div = $("#explosao1");

        div.css("top", lexY);
        div.css("left", lexX);
        div.animate({
            width: 200, opacity: 0
        }, "slow"); // Função do JQuery

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }

    // Reposiciona carro

    function reposicionaCarro() {
        var tempoColisao4 = window.setInterval(reposiciona4, 7000);

        function reposiciona4() {
            window.setInterval(tempoColisao4);
            tempoColisao4 = null;

            if(fimdeJogo == false) {
                $("#fundoGame").append("<div id='carro'></div>")
            }
        }
    }

    // Explosão 2
    function explosao2(carroX, carroY) {

        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url('./assets/img/explosao.png')");

        var div2 = $("#explosao2");

        div2.css("top", carroY);
        div2.css("left", carroX);
        div2.animate({
            width: 200,
            opacity: 0
        }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    // Reposiciona Civil
    function reposicionaCivil() {
        var tempoCivil = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoCivil);
            tempoCivil = null;

            if(fimdeJogo == false) {
                $("#fundoGame").append("<div id='civil' class='anima3'></div>");
            }
        }
    }

    // Explosão 3
    function explosao3 (civilX, civilY) {

        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>'");
        $("#explosao3").css("top", civilY);
        $("#explosao3").css("left", civilX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    function placar() {
        $("#placar").html("<h2>Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    // Barra de energia

    function vidas() {
        if(vidaAtual == 5) {
            $("#vidas").css("background-image", "url('./assets/img/vidas-5.png')");
        }
        if(vidaAtual == 4) {
            $("#vidas").css("background-image", "url('./assets/img/vidas-4.png')");
        }
        if(vidaAtual == 3) {
            $("#vidas").css("background-image", "url('./assets/img/vidas-3.png')");
        }
        if(vidaAtual == 2) {
            $("#vidas").css("background-image", "url('./assets/img/vidas-2.png')");
        }
        if(vidaAtual == 1) {
            $("#vidas").css("background-image", "url('./assets/img/vidas-1.png')");
        }
        if(vidaAtual == 0) {
            $("#vidas").css("background-image", "url('./assets/img/vidas-0.png')");
            // Game Over
            gameOver();
        }
    }

    function gameOver() {
        fimdeJogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#lex").remove();
        $("#carro").remove();
        $("#civil").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html("<h1>Game Over</h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onclick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    }
}

function reiniciaJogo() {
    somGameOver.pause();
    $("#fim").remove();
    start();
}