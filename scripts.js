let type = "message";
let nomeDestino = "Todos";
let nomeUsuario = prompt("Qual o seu nome?");
entrarNasala ();

function entrarNasala () {
    const usuario = { name: nomeUsuario};
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

    promise.then(sucessoEntrada);
    promise.catch(erroEntrada);
}

function erroEntrada () {
    nomeUsuario = prompt("Este nome já está em uso.\n\nEscolha outro nome");
    entrarNasala();
}

function sucessoEntrada () {
    setInterval(manterConexao, 4000);
    setInterval(atualizarPagina, 3000);
    setInterval(buscaUsuarios, 10000);
}

function manterConexao () {
    const usuario = { name: nomeUsuario};
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}

function atualizarPagina () {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mensagens);
}

function mensagens (resposta) {
    let conteudo = document.querySelector(".conteudo");
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
        } else if (resposta.data[i].type === "private_message" && resposta.data[i].to === nomeUsuario) {
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
    const mensagemDigitada = document.querySelector("input").value;

    const dadosMensagem = {
        from: nomeUsuario,
        to: nomeDestino, 
        text: mensagemDigitada,
        type: type 
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dadosMensagem);
    promise.then(atualizarPagina);
    promise.catch(refresh);
    document.querySelector("input").value = "";
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
    let pessoas = document.querySelector(".pessoas");
    pessoas.innerHTML = `
    <div class="alinhamento">
        <div class="clicavel" onclick="destinatario (this)">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </div>
        <ion-icon name="checkmark" class="transparente"></ion-icon>
    </div>
    `;

    for (let i = 0; i < resposta.data.length; i++) {
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

function destinatario (elemento) {
    nomeDestino = elemento.querySelector("p").innerHTML;
    console.log(nomeDestino);

    let verificaCheck = document.querySelector(".pessoas .opaco");
    if (verificaCheck !== null) {
        verificaCheck.classList.remove("opaco");
    }

    let pai = elemento.parentNode;
    pai.querySelector(".transparente").classList.add("opaco");
}

function tipoMensagem (elemento) {
    let tipo = elemento.querySelector("p").innerHTML;

    let verificaCheck = document.querySelector(".visibilidade .opaco");
    if (verificaCheck !== null) {
        verificaCheck.classList.remove("opaco");
    }

    let pai = elemento.parentNode;
    pai.querySelector(".transparente").classList.add("opaco");

    if (tipo === "Público") {
        console.log("message");
        type = "message";
    } else if (tipo === "Reservadamente") {
        console.log("private_message");
        type = "private_message";
    }
}