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
    
}