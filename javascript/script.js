const formulario = document.querySelector("#form-tarefa");
const inputTarefa = document.querySelector("#input-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");

let tarefas = [];

const atualizarContador = () => {
  const pendente = tarefas.filter((tarefa) => !tarefa.concluida).length;
  contador.textContent = pendente + " tarefas pendentes";
};

function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa) => {
    const li = document.createElement("li");

    if (tarefa.concluida) {
      li.classList.add("concluida");
    }

    li.innerHTML = `
      <span>${tarefa.texto}</span>
      ${!tarefa.concluida ? `<button data-id="${tarefa.id}" class="btn-concluir">✓</button>` : ""}
      <button data-id="${tarefa.id}" class="btn-remover">✗</button>
    `;

    listaTarefas.appendChild(li);
  });

  atualizarContador();
}

// ========== FUNÇÕES DA API ==========

async function carregarTarefas() {
  try {
    const response = await fetch("http://localhost:3000/tarefas");
    tarefas = await response.json();
    renderizarTarefas();
  } catch (erro) {
    console.error("Erro ao carregar tarefas:", erro);
    alert(
      "Erro ao conectar com o servidor. Verifique se o backend está rodando.",
    );
  }
}

async function adicionarTarefa(texto) {
  try {
    const response = await fetch("http://localhost:3000/nova-tarefa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });

    if (response.ok) {
      await carregarTarefas(); // Recarrega a lista do servidor
    } else {
      const erro = await response.json();
      alert("Erro: " + erro.erro);
    }
  } catch (erro) {
    console.error("Erro ao adicionar tarefa:", erro);
    alert("Erro ao conectar com o servidor.");
  }
}

async function concluirTarefa(id) {
  try {
    const response = await fetch(`http://localhost:3000/tarefa/${id}`, {
      method: "PUT",
    });

    if (response.ok) {
      await carregarTarefas(); // Recarrega a lista
    } else {
      alert("Erro ao concluir tarefa");
    }
  } catch (erro) {
    console.error("Erro ao concluir tarefa:", erro);
    alert("Erro ao conectar com o servidor.");
  }
}

async function removerTarefa(id) {
  try {
    const response = await fetch(`http://localhost:3000/tarefa/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await carregarTarefas(); // Recarrega a lista
    } else {
      alert("Erro ao remover tarefa");
    }
  } catch (erro) {
    console.error("Erro ao remover tarefa:", erro);
    alert("Erro ao conectar com o servidor.");
  }
}

// ========== EVENTOS ==========

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const texto = inputTarefa.value.trim();

  if (texto === "") return;

  await adicionarTarefa(texto);

  inputTarefa.value = "";
  inputTarefa.focus();
});

listaTarefas.addEventListener("click", async function (evento) {
  const alvo = evento.target;
  const id = alvo.dataset.id;

  if (!id) return;

  if (alvo.classList.contains("btn-concluir")) {
    await concluirTarefa(parseInt(id));
  }

  if (alvo.classList.contains("btn-remover")) {
    await removerTarefa(parseInt(id));
  }
});

// ========== INICIALIZAÇÃO ==========
carregarTarefas();
