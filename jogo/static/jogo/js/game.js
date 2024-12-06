document.addEventListener("DOMContentLoaded", function() {    
    let imgs = [];
    let cardsVirados = [];
    let modalAgain = document.querySelector("#modalAgain");
    let acertos = 0;
    let viradas = 0;
    let contadorSpan = document.getElementById("contador");
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const jogadorId = document.querySelector('input[name=jogador_id]').value;  
    console.log("ID do Jogador:", jogadorId);

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 2; j++) {
            let img = {
                src: "/static/jogo/img/" + i + ".png",
                id: i
            };
            imgs.push(img);
        }
    }

    comecarJogo();

    function comecarJogo() {
        acertos = 0;
        cardsVirados = [];
        imgs = embaralhar(imgs);
        viradas = 0;

        let frontFaces = document.getElementsByClassName("front");
        let backFaces = document.getElementsByClassName("back");

        for (let i = 0; i < 12; i++) {
            frontFaces[i].classList.remove("virado", "acerto");
            backFaces[i].classList.remove("virado", "acerto");

            let card = document.querySelector("#card" + i);
            card.style.left = i % 6 === 0 ? "5px" : (i % 6) * 165 + 5 + "px";
            card.style.top = i < 6 ? "5px" : "250px";

            card.addEventListener("click", virarCard, false);
            frontFaces[i].style.background = "url('" + imgs[i].src + "')";

            frontFaces[i].setAttribute("id", imgs[i].id);
        }
        modalAgain.style.display = "none";
        modalAgain.removeEventListener("click", comecarJogo, false);
    }

    function embaralhar(velhoArray) {
        let novoArray = [];
        while (velhoArray.length > 0) {
            let i = Math.floor(Math.random() * velhoArray.length);
            novoArray.push(velhoArray.splice(i, 1)[0]);
        }
        return novoArray;
    }

    function virarCard() {
        if (cardsVirados.length < 2) {
            let faces = this.getElementsByClassName("face");
            if (faces[0].classList.length > 2) {
                return;
            }
            faces[0].classList.toggle("virado");
            faces[1].classList.toggle("virado");
            cardsVirados.push(this);
            viradas++;
            contadorSpan.textContent = viradas;

            if (cardsVirados.length === 2) {
                if (cardsVirados[0].childNodes[3].id === cardsVirados[1].childNodes[3].id) {
                    acertos++;
                    cardsVirados = [];
                    if (acertos === 6) {
                        fimDeJogo();
                    }
                } else {
                    setTimeout(desvirarCartas, 1000);
                }
            }
        }
    }

    function desvirarCartas() {
        if (cardsVirados.length === 2) {
            cardsVirados[0].childNodes[1].classList.toggle("virado");
            cardsVirados[0].childNodes[3].classList.toggle("virado");
            cardsVirados[1].childNodes[1].classList.toggle("virado");
            cardsVirados[1].childNodes[3].classList.toggle("virado");
            cardsVirados = [];
        }
    }

    function fimDeJogo() {
        modalAgain.style.display = "block";
        modalAgain.style.zIndex = 9999;
        modalAgain.addEventListener("click", comecarJogo, false);

        const tentativas = contadorSpan.textContent;

        fetch('/finalizar_partida/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams({
                'jogador_id': jogadorId,
                'tentativas': tentativas
            })
        }).then(response => response.json())
          .then(data => {
              console.log('Resposta JSON:', data);
              if (data.success) {
                  console.log('Tentativas enviadas com sucesso');
              } else {
                  console.error('Erro ao enviar tentativas:', data.error);
              }
          })
          .catch(error => console.error('Erro na requisição:', error));
        }
    document.getElementById("imgAgain").addEventListener("click", fimDeJogo);
}());