const formulario = document.querySelector("#form-tarefa");
const inputTarefa = document.querySelector("#input-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");

let tarefas = JSON.parse(window.localStorage.getItem("tarefas")) || [];
// renderizarTarefas();
let proximoId = 1;


// function saudacao(noeme) {
//    return "Batata "+ noeme;
// }
// console.log(saudacao("São Paulo"));

// const saudacao2 = (nome) => "Batata " + nome;
// console.log(saudacao2("São Paulo"));

function criarTarefa(texto) {
    return {
        id: proximoId,
        texto: texto,
        concluida: false
    };
}

const atualizarContador = () => {
    const pendente = tarefas.filter(tarefa => !tarefa.concluida).length;

    contador.textContent = pendente + " tareas pendentes";
}

// const frutas = ["banana", "maçã", "melão", "abacaxi"];

// for(let i = 0; i < frutas.length; i++) {
//     console.log(frutas[i]);
// }

// for(const fruta of frutas) {
//     console.log(fruta);
// }

// frutas.forEach(element => {
//     console.log(element);
// });

// const numeros = [1, 2, 3, 4, 5];
// console.log(numeros);
// const numerosDobrados = numeros.map(n => n * 2);
// console.log(numerosDobrados);

function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    tarefas.forEach(tarefa => {
        const li = document.createElement("li");
       
        
        if(tarefa.concluida) {
            li.classList.add("concluida");
        }

        li.innerHTML = `
            <span>${tarefa.texto}</span>
            ${tarefa.concluida == true ? `` : `<button data-id="${tarefa.id}" class="btn-concluir">C</button>`}
            <button data-id="${tarefa.id}" class="btn-remover">X</button>
        `

        listaTarefas.appendChild(li);

    });

    atualizarContador();
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const texto = inputTarefa.value.trim();

    if(texto === "") return;

    const novaTarefa = criarTarefa(texto);
    proximoId++;
    tarefas.push(novaTarefa);

    window.localStorage.setItem("tarefas", JSON.stringify(tarefas));

    inputTarefa.value = "";
    inputTarefa.focus();

    renderizarTarefas();
});

listaTarefas.addEventListener("click", function(evento) {
    const alvo = evento.target;

    const id = (alvo.dataset.id);

    if(alvo.classList.contains("btn-concluir")) {
        alternarConcluida(id);
    }

    if(alvo.classList.contains("btn-remover")) {
        removerTarefa(id);
    }
});

function alternarConcluida(id) {
    const tarefa = tarefas.find(t => t.id == id);
    
    tarefa.concluida = true;
    renderizarTarefas();
}

function removerTarefa(id) {
    tarefas = tarefas.filter(t => t.id != id);

    tarefas = tarefas.filter(t => t.id != id);
    renderizarTarefas();
}
renderizarTarefas();