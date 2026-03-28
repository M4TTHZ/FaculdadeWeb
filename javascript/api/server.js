const http = require("http");

const tarefas = [
    {id: 1, titulo: "Comprar leite", concluida: false},
    {id: 2, titulo: "Estudar JavaScript", concluida: true},
    {id: 3, titulo: "Fazer exercícios de programação", concluida: false}
];

let proximoId = 4;

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

function criarTarefa(texto) {
    return {
        id: proximoId,
        texto: texto,
        concluida: false
    };
}

const servidor = http.createServer(async (req, res) => {

    const url = req.url;
    const metodo = req.method;

    if(metodo === "GET" && url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Bem vindo a API");
        return;
    }

    if(metodo === "GET" && url === "/sobre") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Esta é a página sobre a API");
        return;
    }

    if(metodo === "GET" && url === "/tarefas") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tarefas));
        return;

    }

    if(metodo === "POST" && url === "/nova-tarefa") {

        const body = await lerBody(req);
        console.log("Dados recebidos:", body);

            const novaTarefa = criarTarefa(body.texto);
            proximoId = proximoId + 1;
            
            tarefas.push(novaTarefa);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Tarefa criada com sucesso", tarefa: novaTarefa }));
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Página não encontrada");


});

servidor.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

