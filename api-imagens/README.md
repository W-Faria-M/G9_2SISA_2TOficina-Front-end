# API de Imagens - Serviços da Oficina

API Node.js para gerenciar upload e servir imagens dos serviços.

## 🚀 Como Iniciar

```bash
# Navegue até a pasta da API
cd api-imagens

# Instale as dependências
npm install

# Inicie o servidor em modo desenvolvimento
npm run dev

# OU em modo produção
npm start
```

A API estará rodando em: **http://localhost:3001**

## 📁 Estrutura de Arquivos

```
api-imagens/
├── server.js                 # Servidor Express
├── package.json              # Dependências
├── imagensServicos.json      # Mapeamento servicoId → filename
└── imagens/                  # Pasta de uploads (criada automaticamente)
    ├── servico_1_xxx.jpg
    ├── servico_2_xxx.png
    └── ...
```

## 🔌 Endpoints Disponíveis

### 1. Upload de Imagem
```
POST /upload
Content-Type: multipart/form-data

Body:
- arquivo: File (imagem)
- servicoId: String (ID do serviço)

Response:
{
  "mensagem": "Upload realizado com sucesso!",
  "servicoId": "1",
  "arquivo": "servico_1_1733700000000.jpg",
  "url": "/imagem/servico_1_1733700000000.jpg"
}
```

### 2. Buscar Imagem por Nome
```
GET /imagem/:filename

Response: Arquivo de imagem
```

### 3. Buscar Imagem por Serviço
```
GET /servico/:servicoId/imagem

Response: Arquivo de imagem (ou 404 se não encontrado)
```

### 4. Deletar Imagem
```
DELETE /servico/:servicoId/imagem

Response:
{
  "mensagem": "Imagem removida com sucesso!"
}
```

### 5. Verificar se Serviço tem Imagem
```
GET /servico/:servicoId/tem-imagem

Response:
{
  "servicoId": "1",
  "temImagem": true,
  "url": "/imagem/servico_1_xxx.jpg"
}
```

### 6. Listar Mapeamentos
```
GET /mapeamento

Response:
{
  "1": "servico_1_xxx.jpg",
  "2": "servico_2_xxx.png"
}
```

## ⚙️ Configurações

- **Porta**: 3001
- **Tamanho máximo**: 5MB por arquivo
- **Formatos aceitos**: JPG, JPEG, PNG, WEBP
- **CORS**: Habilitado para todas as origens

## 📝 Observações

- Ao fazer upload de uma nova imagem para um serviço que já possui imagem, a antiga é automaticamente deletada
- Os arquivos são salvos com padrão: `servico_{id}_{timestamp}.{ext}`
- O mapeamento é persistido no arquivo `imagensServicos.json`
