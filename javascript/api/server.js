const http = require("http");

let tarefas = [];
let proximoId = 1;

function lerBody(req) {
  return new Promise((resolve, reject) => {
    let dados = "";

    req.on("data", (chunk) => {
      dados += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(dados ? JSON.parse(dados) : {});
      } catch (erro) {
        reject(new Error("JSON inválido"));
      }
    });

    req.on("error", reject);
  });
}

const servidor = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;
  const metodo = req.method;

  // GET /tarefas - Listar todas as tarefas
  if (metodo === "GET" && url === "/tarefas") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(tarefas));
    return;
  }

  // POST /nova-tarefa - Criar nova tarefa
  if (metodo === "POST" && url === "/nova-tarefa") {
    try {
      const body = await lerBody(req);

      if (!body.texto || body.texto.trim() === "") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ erro: "Texto da tarefa é obrigatório" }));
        return;
      }

      const novaTarefa = {
        id: proximoId++,
        texto: body.texto,
        concluida: false,
      };

      tarefas.push(novaTarefa);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(novaTarefa));
    } catch (erro) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ erro: erro.message }));
    }
    return;
  }

  // PUT /tarefa/:id - Concluir tarefa
  if (metodo === "PUT" && url.startsWith("/tarefa/")) {
    const id = parseInt(url.split("/")[2]);
    const tarefa = tarefas.find((t) => t.id === id);

    if (!tarefa) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ erro: "Tarefa não encontrada" }));
      return;
    }

    tarefa.concluida = true;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tarefa));
    return;
  }

  // DELETE /tarefa/:id - Remover tarefa
  if (metodo === "DELETE" && url.startsWith("/tarefa/")) {
    const id = parseInt(url.split("/")[2]);
    const tamanhoAntes = tarefas.length;

    tarefas = tarefas.filter((t) => t.id !== id);

    if (tarefas.length === tamanhoAntes) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ erro: "Tarefa não encontrada" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ mensagem: "Tarefa removida com sucesso" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Rota não encontrada");
});

servidor.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
  console.log("Endpoints disponíveis:");
  console.log("  GET    /tarefas");
  console.log("  POST   /nova-tarefa");
  console.log("  PUT    /tarefa/:id");
  console.log("  DELETE /tarefa/:id");
});
