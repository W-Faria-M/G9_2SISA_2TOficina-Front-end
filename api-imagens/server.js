import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ---------------------------
//  CONFIGURAÇÃO DE DIRETÓRIOS
// ---------------------------
const imagensDir = path.resolve(__dirname, 'imagens');
const mappingFile = path.resolve(__dirname, 'imagensServicos.json');

// Cria pasta de imagens se não existir
if (!fs.existsSync(imagensDir)) {
  fs.mkdirSync(imagensDir, { recursive: true });
}

// Cria arquivo de mapeamento se não existir
if (!fs.existsSync(mappingFile)) {
  fs.writeFileSync(mappingFile, JSON.stringify({}));
}

// ---------------------------
//  FUNÇÕES AUXILIARES
// ---------------------------
function lerMapeamento() {
  const data = fs.readFileSync(mappingFile, 'utf-8');
  return JSON.parse(data);
}

function salvarMapeamento(mapping) {
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
}

// ---------------------------
//  CONFIGURAÇÃO DO MULTER
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagensDir);
  },
  filename: (req, file, cb) => {
    const servicoId = req.body.servicoId || 'temp';
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `servico_${servicoId}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens (jpg, jpeg, png, webp) são permitidas!'));
    }
  }
});

// ---------------------------
//  ENDPOINTS
// ---------------------------

// 1. UPLOAD de imagem vinculada a um serviço
app.post('/upload', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  const { servicoId } = req.body;
  
  if (!servicoId) {
    // Remove arquivo se servicoId não foi fornecido
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'servicoId é obrigatório.' });
  }

  // Atualiza mapeamento
  const mapping = lerMapeamento();
  
  // Remove imagem antiga se existir
  if (mapping[servicoId]) {
    const oldFilePath = path.join(imagensDir, mapping[servicoId]);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }
  
  mapping[servicoId] = req.file.filename;
  salvarMapeamento(mapping);

  res.status(200).json({
    mensagem: 'Upload realizado com sucesso!',
    servicoId: servicoId,
    arquivo: req.file.filename,
    url: `/imagem/${req.file.filename}`
  });
});

// 2. BUSCAR imagem por nome de arquivo
app.get('/imagem/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(imagensDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado.' });
  }

  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.sendFile(filePath);
});

// 3. BUSCAR imagem por servicoId
app.get('/servico/:servicoId/imagem', (req, res) => {
  const { servicoId } = req.params;
  const mapping = lerMapeamento();
  
  if (!mapping[servicoId]) {
    return res.status(404).json({ error: 'Nenhuma imagem encontrada para este serviço.' });
  }

  const filename = mapping[servicoId];
  const filePath = path.join(imagensDir, filename);

  if (!fs.existsSync(filePath)) {
    // Remove do mapeamento se arquivo não existe
    delete mapping[servicoId];
    salvarMapeamento(mapping);
    return res.status(404).json({ error: 'Arquivo não encontrado.' });
  }

  res.sendFile(filePath);
});

// 4. DELETAR imagem de um serviço
app.delete('/servico/:servicoId/imagem', (req, res) => {
  const { servicoId } = req.params;
  const mapping = lerMapeamento();
  
  if (!mapping[servicoId]) {
    return res.status(404).json({ error: 'Nenhuma imagem encontrada para este serviço.' });
  }

  const filename = mapping[servicoId];
  const filePath = path.join(imagensDir, filename);

  // Remove arquivo físico
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove do mapeamento
  delete mapping[servicoId];
  salvarMapeamento(mapping);

  res.status(200).json({ mensagem: 'Imagem removida com sucesso!' });
});

// 5. LISTAR todos os mapeamentos
app.get('/mapeamento', (req, res) => {
  const mapping = lerMapeamento();
  res.status(200).json(mapping);
});

// 6. VERIFICAR se serviço tem imagem
app.get('/servico/:servicoId/tem-imagem', (req, res) => {
  const { servicoId } = req.params;
  const mapping = lerMapeamento();
  
  res.status(200).json({
    servicoId: servicoId,
    temImagem: !!mapping[servicoId],
    url: mapping[servicoId] ? `/imagem/${mapping[servicoId]}` : null
  });
});

// ---------------------------
//  INICIAR SERVIDOR
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 API de Imagens rodando em http://localhost:${PORT}`);
  console.log(`📁 Diretório de imagens: ${imagensDir}`);
  console.log(`📋 Arquivo de mapeamento: ${mappingFile}`);
});
