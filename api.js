const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const clientes = [];
const produtos = [];

// Função auxiliar para encontrar um cliente pelo ID
function findClienteById(id) {
  const cliente = clientes.find((c) => c.id === id);
  return cliente ? { ...cliente, produtos: cliente.produtos || [] } : null;
}

// Função auxiliar para encontrar um produto pelo ID
function findProdutoById(id) {
  return produtos.find((produto) => produto.id === id);
}

app.get('/api/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cliente = findClienteById(id);
  
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado.' });
    }
  });

app.get('/api/clientes', (req, res) => {
    const clientesComProdutos = clientes.map((cliente) => {
      return {
        ...cliente,
        produtos: cliente.produtos.map((produtoId) => findProdutoById(produtoId)),
      };
    });
  
    res.json(clientesComProdutos);
  });
  

// Rota para criar um novo cliente
app.post('/api/clientes', (req, res) => {
  const novoCliente = req.body;
  novoCliente.id = clientes.length + 1;
  novoCliente.produtos = [];
  clientes.push(novoCliente);
  res.json(novoCliente);
});

// Rota para editar um cliente pelo ID
app.put('/api/clientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const clienteIndex = clientes.findIndex((cliente) => cliente.id === id);

  if (clienteIndex !== -1) {
    clientes[clienteIndex] = { ...clientes[clienteIndex], ...req.body };
    res.json(clientes[clienteIndex]);
  } else {
    res.status(404).json({ message: 'Cliente não encontrado.' });
  }
});

// Rota para obter todos os produtos
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

// Rota para criar um novo produto
app.post('/api/produtos', (req, res) => {
  const novoProduto = req.body;
  novoProduto.id = produtos.length + 1;
  produtos.push(novoProduto);
  res.json(novoProduto);
});

// Rota para editar um produto pelo ID
app.put('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = produtos.findIndex((produto) => produto.id === id);

  if (produtoIndex !== -1) {
    produtos[produtoIndex] = { ...produtos[produtoIndex], ...req.body };
    res.json(produtos[produtoIndex]);
  } else {
    res.status(404).json({ message: 'Produto não encontrado.' });
  }
});

app.put('/api/clientes/:clienteId/produtos/', (req, res) => {
    const clienteId = parseInt(req.params.clienteId);
    const produtosIds = req.body.produtosIds;

    const clienteIndex = clientes.findIndex((c) => c.id === clienteId);

    if (clienteIndex !== -1) {
        // Atualizar a lista de produtos associados ao cliente
        clientes[clienteIndex].produtos = produtosIds.map((produtoId) => parseInt(produtoId)).filter(Boolean);

        res.json(clientes[clienteIndex]);
    } else {
        res.status(404).json({ message: 'Cliente não encontrado.' });
    }
});



app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
