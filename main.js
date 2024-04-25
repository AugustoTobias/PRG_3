document.addEventListener("DOMContentLoaded", function() {
    var cpfInput = document.getElementById('cpfInput');
    var cepInput = document.getElementById('cepInput');
    
    // Aplicar a máscara ao campo CPF
    Inputmask("999.999.999-99").mask(cpfInput);
    
    // Aplicar a máscara ao campo CEP
    Inputmask("99999-999").mask(cepInput);
});

let cadastrarBtn = document.getElementById('cadastrarBtn');
let excluirBtn = document.getElementById('excluirBtn');
let editarBtn = document.getElementById('editarBtn');

let nomeInput = document.getElementById('nomeInput');
let cpfInput = document.getElementById('cpfInput');
let salarioInput = document.getElementById('salarioInput');
let funcaoInput = document.getElementById('funcaoInput');
let departamentoInput = document.getElementById('departamentoInput');
let cepInput = document.getElementById('cepInput');

let tabela = document.querySelector('#Saida table');
let BD = [];

// Eventos de clique nos botões
cadastrarBtn.onclick = cadastrarFuncionario;
excluirBtn.onclick = excluirFuncionario;
editarBtn.onclick = editarFuncionario;

// Função para cadastrar um novo funcionário
function cadastrarFuncionario() {
    // Validar os inputs aqui
    let funcionario = {
        nome: nomeInput.value,
        cpf: cpfInput.value,
        salario: salarioInput.value,
        funcao: funcaoInput.value,
        departamento: departamentoInput.value,
        cep: cepInput.value,
        id: BD.length
    };
    BD.push(funcionario);
    adicionarFuncionarioNaTabela(funcionario);
}

// Função para excluir um funcionário
function excluirFuncionario() {
    let idsSelecionados = [];
    document.querySelectorAll('#Saida table tr td input[type="checkbox"]:checked').forEach(input => {
        idsSelecionados.push(parseInt(input.id));
    });
    BD = BD.filter(funcionario => !idsSelecionados.includes(funcionario.id));
    renderizarTabela();
}

// Função para editar um funcionário
function editarFuncionario() {
    let inputsSelecionados = document.querySelectorAll('#Saida table tr td input[type="checkbox"]:checked');
    if (inputsSelecionados.length === 1) {
        let idSelecionado = parseInt(inputsSelecionados[0].id);
        if (idSelecionado >= 0 && idSelecionado < BD.length) {
            BD[idSelecionado] = {
                nome: nomeInput.value,
                cpf: cpfInput.value,
                salario: salarioInput.value,
                funcao: funcaoInput.value,
                departamento: departamentoInput.value,
                cep: cepInput.value,
                id: idSelecionado
            };
            renderizarTabela();
        }
    }
}

// Função para adicionar um funcionário na tabela
function adicionarFuncionarioNaTabela(funcionario) {
    let row = tabela.insertRow(-1);
    row.insertCell(0).innerHTML = `<input type="checkbox" id="${funcionario.id}">`;
    row.insertCell(1).textContent = funcionario.nome;
    row.insertCell(2).textContent = funcionario.cpf;
    row.insertCell(3).textContent = funcionario.salario;
    row.insertCell(4).textContent = funcionario.funcao;
    row.insertCell(5).textContent = funcionario.departamento;
    row.insertCell(6).textContent = funcionario.cep;
}

// Função para renderizar a tabela com os funcionários
function renderizarTabela() {
    tabela.innerHTML = `<tr><th></th><th>Nome</th><th>CPF</th><th>Salário</th><th>Função</th><th>Departamento</th><th>CEP</th></tr>`;
    BD.forEach(funcionario => {
        adicionarFuncionarioNaTabela(funcionario);
    });
}

// Função para limpar os campos de entrada após o cadastro
function limparCampos() {
    nomeInput.value = "";
    cpfInput.value = "";
    salarioInput.value = "";
    funcaoInput.value = "";
    departamentoInput.value = "";
    cepInput.value = "";
}

// Adicionando evento de clique para o botão "Visualizar"
document.getElementById('visualizarBtn').addEventListener('click', async function() {
    // Verificando se pelo menos um funcionário está selecionado
    let inputsSelecionados = document.querySelectorAll('#Saida table tr td input[type="checkbox"]:checked');
    if (inputsSelecionados.length === 1) {
        // Obtendo o ID do funcionário selecionado
        let idSelecionado = parseInt(inputsSelecionados[0].id);
        // Verificando se o ID é válido e está dentro dos limites do array BD
        if (!isNaN(idSelecionado) && idSelecionado >= 0 && idSelecionado < BD.length) {
            // Obtendo o funcionário correspondente ao ID
            let funcionarioSelecionado = BD[idSelecionado];
            // Abrindo uma nova guia em modo janela com as informações do funcionário
            let novaGuia = window.open('', '_blank', 'width=600,height=400');
            novaGuia.document.write(`<h1>Informações do Funcionário</h1>`);
            novaGuia.document.write(`<p><strong>Nome:</strong> ${funcionarioSelecionado.nome}</p>`);
            novaGuia.document.write(`<p><strong>CPF:</strong> ${funcionarioSelecionado.cpf}</p>`);
            novaGuia.document.write(`<p><strong>Salário:</strong> ${funcionarioSelecionado.salario}</p>`);
            novaGuia.document.write(`<p><strong>Função:</strong> ${funcionarioSelecionado.funcao}</p>`);
            novaGuia.document.write(`<p><strong>Departamento:</strong> ${funcionarioSelecionado.departamento}</p>`);
            novaGuia.document.write(`<p><strong>CEP:</strong> ${funcionarioSelecionado.cep}</p>`);
    
            // Consultar o CEP
            const dadosCEP = await consultarCEP(funcionarioSelecionado.cep);
            if (dadosCEP) {
                novaGuia.document.write(`<h2>Endereço</h2>`);
                novaGuia.document.write(`<p><strong>Logradouro:</strong> ${dadosCEP.logradouro}</p>`);
                novaGuia.document.write(`<p><strong>Bairro:</strong> ${dadosCEP.bairro}</p>`);
                novaGuia.document.write(`<p><strong>Cidade:</strong> ${dadosCEP.localidade}</p>`);
                novaGuia.document.write(`<p><strong>Estado:</strong> ${dadosCEP.uf}</p>`);
            } else {
                novaGuia.document.write(`<p>Falha ao consultar o CEP.</p>`);
            }
    
        }
    } else {
        alert('Por favor, selecione um funcionário para visualizar.');
    }
});

// Função para consultar o CEP usando a API dos Correios
async function consultarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao consultar o CEP:', error);
        return null;
    }
}

// Adicionando evento de clique para o botão "Pesquisar"
document.querySelector('.api').addEventListener('click', async function() {
    let cep = document.getElementById('cepInput').value;
    // Verificando se o campo CEP está preenchido
    if (cep.trim() !== '') {
        // Consultar o CEP
        const dadosCEP = await consultarCEP(cep);
        if (dadosCEP) {
            // Preencher os campos de endereço com os dados obtidos
            document.getElementById('logradouro').value = dadosCEP.logradouro;
            document.getElementById('bairro').value = dadosCEP.bairro;
            document.getElementById('cidade').value = dadosCEP.localidade;
            document.getElementById('uf').value = dadosCEP.uf;
        } else {
            alert('CEP não encontrado. Por favor, verifique e tente novamente.');
        }
    } else {
        alert('Por favor, preencha o campo CEP antes de pesquisar.');
    }
});





