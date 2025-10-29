/**
 * js-utils.js
 * Arquivo com umas funções úteis pra gente não ficar repetindo código.
 */

/**
 * Valida um campo do formulário. Vê se não tá vazio, se é um email de verdade, etc.
 * @param {string} fieldName - Qual campo a gente tá validando (ex: 'email', 'senha').
 * @param {string} value - O que o usuário digitou no campo.
 * @param {object} form - O formulário inteiro, caso a gente precise comparar com outro campo (como senha e confirmar senha).
 * @returns {string|undefined} Se der erro, volta a mensagem. Se tiver tudo certo, volta `undefined`.
 */
export const validateField = (fieldName, value, form = {}) => {
  switch (fieldName) {
    case "nome":
    case "sobrenome":
    case "nomeServico": // Nome do serviço
    case "nomeCategoria": // Nome da categoria
      if (!value.trim()) return "Opa, esse campo é obrigatório!";
      break;
    case "email":
      if (!value.trim()) return "E-mail é obrigatório, né?";
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return "E-mail inválido. Confere aí!";
      break;
    case "telefone":
      if (!value.trim()) return "Telefone é obrigatório.";
      if (!/^\d{8,}$/.test(value)) return "Telefone inválido. Pelo menos 8 dígitos.";
      break;
    case "senha":
      if (!value) return "Senha é obrigatória.";
      if (value.length < 4) return "Senha muito curta, precisa de pelo menos 4 caracteres.";
      break;
    case "confirmarSenha":
      if (!value) return "Confirma a senha, por favor.";
      if (value !== form.senha) return "As senhas não batem, hein!";
      break;
    case "veiculo": // Campo de agendamento
      if (!value.trim()) return "Qual veículo vai ser agendado?";
      break;
    case "data": // Campo de agendamento
      if (!value.trim()) return "A data do agendamento é obrigatória.";
      // Poderíamos adicionar uma validação de formato de data aqui, se precisar
      break;
    case "hora": // Campo de agendamento
      if (!value.trim()) return "A hora do agendamento é obrigatória.";
      // Poderíamos adicionar uma validação de formato de hora aqui, se precisar
      break;
    case "tempoEntrega": // Campo de agendamento
      if (!value.trim()) return "O tempo de entrega é obrigatório.";
      break;
    case "status": // Campo de agendamento e serviço
      if (!value.trim()) return "O status é obrigatório.";
      break;
    case "servico": // Campo de agendamento
    case "categoria": // Campo de serviço
      if (!value.trim()) return "Escolha uma opção, por favor.";
      break;
    case "descricao": // Campo de serviço
      if (!value.trim()) return "A descrição do serviço é obrigatória.";
      break;
    case "preco": // Campo de serviço (assumindo que existe)
      if (!value) return "O preço é obrigatório.";
      if (isNaN(value) || parseFloat(value) <= 0) return "Preço inválido. Tem que ser um número maior que zero.";
      break;
    default:
      break;
  }
  return undefined;
};

/**
 * Valida o formulário todo de uma vez. Pega todos os campos que a gente quer validar e usa a `validateField` pra cada um.
 * @param {object} form - O formulário com todos os dados.
 * @param {string[]} fieldsToValidate - Uma lista dos nomes dos campos que a gente quer checar.
 * @returns {object} Um objeto com os erros encontrados. Se não tiver erro, o objeto fica vazio.
 */
export const validateForm = (form, fieldsToValidate) => {
  const newErrors = {};
  fieldsToValidate.forEach(field => {
    const error = validateField(field, form[field], form);
    if (error) {
      newErrors[field] = error;
    }
  });
  return newErrors;
};

/**
 * Faz uma chamada pra nossa API (JSON Server, por enquanto). Serve pra GET, POST, PUT, DELETE.
 * @param {string} url - Pra onde a gente vai mandar a requisição (ex: 'http://localhost:3001/servicos').
 * @param {string} method - Qual tipo de requisição (GET, POST, PUT, DELETE). Padrão é GET.
 * @param {object} [data=null] - Os dados que a gente quer mandar (só pra POST/PUT).
 * @returns {Promise<object>} Volta os dados que a API respondeu.
 * @throws {Error} Se a API der erro, a gente avisa.
 */
export const apiRequest = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    // Tenta pegar a mensagem de erro da API, se tiver
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Erro na API! Status: ${response.status}, Mensagem: ${errorData.message || response.statusText}`);
  }

  // Se a resposta for JSON, a gente já converte. Se não for, volta um objeto vazio.
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return {};
  }
};

/**
 * Formata uma data pra ficar no padrão brasileiro (DD/MM/AAAA). Bem útil pra mostrar pro usuário.
 * @param {string|Date} dateInput - A data que a gente quer formatar.
 * @returns {string} A data bonitinha no formato DD/MM/AAAA.
 */
export const formatarData = (dateInput) => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa do 0, então tem que somar 1
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Deixa a primeira letra de uma frase maiúscula. Pra deixar o texto mais apresentável.
 * @param {string} str - A frase que a gente quer arrumar.
 * @returns {string} A frase com a primeira letra maiúscula.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return ""; // Se não tiver nada, volta vazio
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Transforma um `true` ou `false` em 'Sim' ou 'Não'. Mais fácil pro usuário entender.
 * @param {boolean} value - O valor booleano.
 * @returns {string} 'Sim' se for `true`, 'Não' se for `false`.
 */
export const booleanToYesNo = (value) => {
  return value ? "Sim" : "Não";
};

/**
 * Gera um ID único simples. Bom pra quando a gente tá criando coisas novas e o backend ainda não deu um ID.
 * @returns {number} Um número que serve como ID único.
 */
export const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Ajuda a lidar com o que o usuário digita nos formulários. Atualiza o estado do formulário e limpa os erros daquele campo.
 * @param {object} currentFormState - Como o formulário tá agora.
 * @param {function} setFormState - A função pra atualizar o formulário.
 * @param {function} setErrorsState - A função pra atualizar os erros.
 * @returns {function} Uma função que você passa pro `onChange` dos inputs.
 */
export const createFormChangeHandler = (currentFormState, setFormState, setErrorsState) => (e) => {
  const { name, value } = e.target;
  setFormState({ ...currentFormState, [name]: value });
  setErrorsState(prevErrors => ({ ...prevErrors, [name]: undefined }));
};

/**
 * Ajuda a lidar com o envio do formulário. Primeiro valida tudo, se tiver erro, mostra. Se não, chama a função que faz o que precisa.
 * @param {object} formState - O estado atual do formulário.
 * @param {function} setErrorsState - A função pra atualizar os erros.
 * @param {function} onSubmitCallback - A função que roda quando o formulário é válido.
 * @param {string[]} fieldsToValidate - Quais campos a gente precisa validar antes de enviar.
 * @returns {function} Uma função que você passa pro `onSubmit` do formulário.
 */
export const createFormSubmitHandler = (formState, setErrorsState, onSubmitCallback, fieldsToValidate) => async (e) => {
  e.preventDefault();
  const validationErrors = validateForm(formState, fieldsToValidate);
  if (Object.keys(validationErrors).length > 0) {
    setErrorsState(validationErrors);
    return;
  }
  await onSubmitCallback(formState);
};
