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
        `
        } else if (resposta.data[i].type === "message") {
            conteudo.innerHTML += `
            <div class="mensagem branca">
                <p><span>${resposta.data[i].time} </span><strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}:</strong>  ${resposta.data[i].text}</p>
            </div>
        `
        } else if (resposta.data[i].type === "private_message" && resposta.data[i].to === nomeUsuario) {
            conteudo.innerHTML += `
            <div class="mensagem rosa">
                <p><span>${resposta.data[i].time} </span><strong>${resposta.data[i].from}</strong> reservadamente para <strong>{resposta.data[i].to}:</strong>  ${resposta.data[i].text}</p>
            </div>
        `
        }
    }
    conteudo.scrollIntoView(false);
}

function enviarMensagem () {
    const mensagemDigitada = document.querySelector("input").value;

    const dadosMensagem = {
        from: nomeUsuario,
        to: "Todos", //mudar no bonus
        text: mensagemDigitada,
        type: "message" //mudar no bonus
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dadosMensagem);
    promise.then(atualizarPagina);
    promise.catch(refresh);
    document.querySelector("input").value = "";
}

function refresh (error) {
    console.log(error.response.status);
    //window.location.reload();
}

function barraLateral () {
    const elemento = document.querySelector(".fundo");
    elemento.classList.remove("escondido");
}