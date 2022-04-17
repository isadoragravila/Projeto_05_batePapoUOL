let type = "message";
let tipo = "público";
let nomeDestino = "Todos";
let nomeUsuario;

function entrarNaSala () {
    nomeUsuario = document.querySelector(".tela-entrada input").value;
    const usuario = { name: nomeUsuario};
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    promise.then(sucessoEntrada);
    promise.catch(erroEntrada);
}

function erroEntrada () {
    alert("Este nome já está em uso.\n\nEscolha outro nome");
    nomeUsuario = "";
    document.querySelector(".tela-entrada input").value = "";
}

function sucessoEntrada () {
    setInterval(manterConexao, 5000);
    setInterval(atualizarPagina, 3000);
    setInterval(buscaUsuarios, 10000);
    setTimeout(trocaTelas, 3000);
    document.querySelector(".tela-entrada input").classList.add("escondido");
    document.querySelector(".tela-entrada .entrar").classList.remove("centralizado");
    document.querySelector(".tela-entrada .entrar").classList.add("escondido");
    document.querySelector(".tela-entrada .carregando").classList.remove("escondido");
}

function trocaTelas () {
    document.querySelector(".tela-entrada").classList.remove("centralizado");
    document.querySelector(".tela-entrada").classList.add("escondido");
    document.querySelector(".conteiner").classList.remove("escondido");
}

function manterConexao () {
    const usuario = { name: nomeUsuario};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}

function atualizarPagina () {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mensagens);
}

function mensagens (resposta) {
    const conteudo = document.querySelector(".conteudo");
    conteudo.innerHTML = "";
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].type === "status") {
            conteudo.innerHTML += `
            <div class="mensagem cinza">
                <p><span>${resposta.data[i].time} </span><strong>${resposta.data[i].from}</strong> ${resposta.data[i].text}</p>
            </div>
        `;
        } else if (resposta.data[i].type === "message") {
            conteudo.innerHTML += `
            <div class="mensagem branca">
                <p><span>${resposta.data[i].time} </span><strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}:</strong>  ${resposta.data[i].text}</p>
            </div>
        `;
        } else if (resposta.data[i].type === "private_message" && (resposta.data[i].to === nomeUsuario || resposta.data[i].to === "Todos")) {
            conteudo.innerHTML += `
            <div class="mensagem rosa">
                <p><span>${resposta.data[i].time} </span><strong>${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}:</strong>  ${resposta.data[i].text}</p>
            </div>
        `;
        } else if (resposta.data[i].type === "private_message" && resposta.data[i].from === nomeUsuario) {
            conteudo.innerHTML += `
            <div class="mensagem rosa">
                <p><span>${resposta.data[i].time} </span><strong>${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}:</strong>  ${resposta.data[i].text}</p>
            </div>
        `;
        }
    }
    conteudo.scrollIntoView(false);
}

function enviarMensagem () {
    const mensagemDigitada = document.querySelector(".barra-inferior input").value;

    if (mensagemDigitada === "") {
        return;
    }

    const dadosMensagem = {
        from: nomeUsuario,
        to: nomeDestino, 
        text: mensagemDigitada,
        type: type 
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dadosMensagem);
    promise.then(atualizarPagina);
    promise.catch(refresh);
    document.querySelector(".barra-inferior input").value = "";
}

function refresh () {
    window.location.reload();
}

function ocultarBarraLateral () {
    const elemento = document.querySelector(".fundo");
    elemento.classList.add("escondido");
    elemento.classList.remove("aparecendo");
}

function barraLateral () {
    buscaUsuarios ();
    const elemento = document.querySelector(".fundo");
    elemento.classList.remove("escondido");
    elemento.classList.add("aparecendo");
}

function buscaUsuarios () {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(exibeUsuarios);
}

function exibeUsuarios (resposta) {
    const pessoas = document.querySelector(".pessoas");
    let contador = 0;
    //FOR para saber se o destinatário é ("Todos" ou alguém q saiu da sala) ou se (está dentro da sala)
    for (let i = 0; i < resposta.data.length; i++) {
        if (nomeDestino !== resposta.data[i].name) {
            contador++;
        }
    }
    //IF se o destinatário for ("Todos" ou alguém q saiu da sala) - ELSE se (está dentro da sala)
    if (contador === resposta.data.length) {
        nomeDestino = "Todos";
        pessoas.innerHTML = `
        <div class="alinhamento">
            <div class="clicavel" onclick="destinatario (this)">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon name="checkmark" class="transparente opaco"></ion-icon>
        </div>
        `;
    } else {
        pessoas.innerHTML = `
        <div class="alinhamento">
            <div class="clicavel" onclick="destinatario (this)">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon name="checkmark" class="transparente"></ion-icon>
        </div>
        `;   
    }
    // exibe os nomes dos usuários ativos
    for (let i = 0; i < resposta.data.length; i++) {
        //IF se destinatário for igual (check aparece) - ELSE se destinatário for diferente (check não aparece)
        if (resposta.data[i].name === nomeDestino) {
            pessoas.innerHTML += `
            <div class="alinhamento">
                <div class="clicavel" onclick="destinatario (this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                </div>
                <ion-icon name="checkmark" class="transparente opaco"></ion-icon>
            </div>
            `;
        } else {
            pessoas.innerHTML += `
            <div class="alinhamento">
                <div class="clicavel" onclick="destinatario (this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                </div>
                <ion-icon name="checkmark" class="transparente"></ion-icon>
            </div>
            `;
        } 
    }
    //atualiza frase que informa o destinatário e o tipo
    document.querySelector(".barra-inferior p").innerHTML = `Enviando para ${nomeDestino} (${tipo})`;
    contador = 0;
}

function destinatario (elemento) {
    nomeDestino = elemento.querySelector("p").innerHTML;

    const verificaCheck = document.querySelector(".pessoas .opaco");
    if (verificaCheck !== null) {
        verificaCheck.classList.remove("opaco");
    }

    const pai = elemento.parentNode;
    pai.querySelector(".transparente").classList.add("opaco");
    //atualiza frase que informa o destinatário e o tipo
    document.querySelector(".barra-inferior p").innerHTML = `Enviando para ${nomeDestino} (${tipo})`;
}

function tipoMensagem (elemento) {
    tipo = elemento.querySelector("p").innerHTML;

    const verificaCheck = document.querySelector(".visibilidade .opaco");
    if (verificaCheck !== null) {
        verificaCheck.classList.remove("opaco");
    }

    const pai = elemento.parentNode;
    pai.querySelector(".transparente").classList.add("opaco");

    if (tipo === "Público") {
        type = "message";
    } else if (tipo === "Reservadamente") {
        type = "private_message";
    }

    tipo = tipo.toLowerCase();
    document.querySelector(".barra-inferior p").innerHTML = `Enviando para ${nomeDestino} (${tipo})`;
}

//apertar ENTER para enviar mensagem
const pressEnter = document.querySelector(".barra-inferior input");
pressEnter.addEventListener('keypress', function(event){
    if(event.keyCode === 13) {
        enviarMensagem ();
    }
  });