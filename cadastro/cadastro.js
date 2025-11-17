let tipoSelecionado = null;

document.addEventListener('DOMContentLoaded', () => {
  emailjs.init('ev12yg_q3vlp5WYd6');
});

function selecionarTipo(tipo) {
  tipoSelecionado = tipo;

  const selecao = document.getElementById("selecaoTipo");
  const container = document.getElementById("containerFormulario");
  selecao?.classList.add("hidden");
  container?.classList.remove("hidden");

  const iconeTipo = document.getElementById("iconeTipo");
  const titulo = document.getElementById("tituloFormulario");
  const descricao = document.getElementById("descricaoFormulario");

  if (!iconeTipo || !titulo || !descricao) return;

  if (tipo === "fisica") {
    iconeTipo.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>';
    titulo.textContent = "Dados da Pessoa Física";
    descricao.textContent = "Preencha os dados pessoais e comerciais";
    montarFormularioPF();
  } else {
    iconeTipo.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>';
    titulo.textContent = "Dados da Pessoa Jurídica";
    descricao.textContent = "Preencha os dados da empresa e do representante legal";
    montarFormularioPJ();
  }
}

function voltarSelecao() {
  document.getElementById("containerFormulario")?.classList.add("hidden");
  document.getElementById("selecaoTipo")?.classList.remove("hidden");
  document.getElementById("formularioCadastro")?.reset();
  document.getElementById("mensagemSucesso")?.classList.add("hidden");
  document.getElementById("formPF").innerHTML = "";
  document.getElementById("formPJ").innerHTML = "";
  tipoSelecionado = null;
}

async function handleSubmit(event) {
  event.preventDefault();
  const btn = document.getElementById("btnSubmit");
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = `
    <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    Cadastrando...
  `;

  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  data.tipo_pessoa = tipoSelecionado;

  const templateParams = mapFormDataToEmailTemplate(data);

  // Escolhe o template conforme o tipo
  const templateId = data.tipo_pessoa === 'fisica' ? 'template_pqgjzvt' : 'template_82f7ail';

  try {
    await emailjs.send('service_2y9uacn', templateId, templateParams);

    document.getElementById("mensagemSucesso")?.classList.remove("hidden");
    form.classList.add("hidden");

    btn.disabled = false;
    btn.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Cadastrar Estabelecimento
    `;
  } catch (err) {
    alert('Erro ao enviar os dados. Tente novamente.');
    btn.disabled = false;
    btn.innerHTML = "Cadastrar Estabelecimento";
    console.error('Erro EmailJS:', err);
  }
}

// Montadores dos formulários

function montarFormularioPF() {
  const pf = document.getElementById("formPF");
  const pj = document.getElementById("formPJ");
  if (!pf || !pj) return;
  pj.classList.add("hidden");
  pf.classList.remove("hidden");

  pf.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${input("Nome Fantasia *","nome_fantasia","text","Digite o nome fantasia")}
      ${input("CPF *","cpf","text","000.000.000-00",'oninput="maskCPF(this)" maxlength="14"')}
      ${input("Data de Nascimento *","data_nascimento","date")}
      ${input("Nome Completo *","nome_completo","text","Digite o nome completo")}
      ${input("E-mail *","email","email","email@exemplo.com")}
      ${input("Telefone Celular *","telefone","tel","(00) 00000-0000",'oninput="maskPhone(this)" maxlength="15"')}
      ${input("Nome da Mãe *","nome_mae","text","Digite a nome da mãe")}
      ${input("Área de Atuação *","area_atuacao","text","Ex: Comércio, Serviços...")}
      
      <div class="md:col-span-2 mt-4 pt-4 border-t-2 border-[#00D9A3]/20">
        <h3 class="text-xl font-bold text-[#0A2F3F] mb-4 flex items-center gap-2">
          <div class="w-1 h-6 bg-gradient-to-b from-[#00D9A3] to-[#00F5B8] rounded-full"></div>
          Endereço
        </h3>
      </div>

      ${input("CEP *","cep_pf","text","00000-000",'oninput="maskCEP(this); buscarCEP(this.value, \'pf\')" maxlength="9"')}
      ${input("Rua *","rua_pf","text","Nome da rua",'id="rua_pf"')}
      ${input("Número *","numero_pf","text","Número")}
      ${input("Complemento","complemento_pf","text","Apto, bloco, etc.",'required=""')}
      ${input("Bairro *","bairro_pf","text","Bairro",'id="bairro_pf"')}
      ${input("Cidade *","cidade_pf","text","Cidade",'id="cidade_pf"')}
      ${input("Estado *","estado_pf","text","UF",'id="estado_pf" maxlength="2"')}
    </div>
  `;
}

function montarFormularioPJ() {
  const pf = document.getElementById("formPF");
  const pj = document.getElementById("formPJ");
  if (!pf || !pj) return;
  pf.classList.add("hidden");
  pj.classList.remove("hidden");

  pj.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${input("CNPJ *","cnpj","text","00.000.000/0000-00",'oninput="maskCNPJ(this)" maxlength="18"')}
      ${input("Razão Social *","razao_social","text","Digite a razão social")}
      ${input("Nome Fantasia *","nome_fantasia_pj","text","Digite o nome fantasia")}
      ${input("Data de Fundação *","data_fundacao","date")}

      <div class="md:col-span-2 mt-4 pt-4 border-t-2 border-[#00D9A3]/20">
        <h3 class="text-xl font-bold text-[#0A2F3F] mb-4 flex items-center gap-2">
          <div class="w-1 h-6 bg-gradient-to-b from-[#00D9A3] to-[#00F5B8] rounded-full"></div>
          Endereço da Empresa
        </h3>
      </div>

      ${input("CEP *","cep_pj","text","00000-000",'oninput="maskCEP(this); buscarCEP(this.value, \'pj\')" maxlength="9"')}
      ${input("Rua *","rua_pj","text","Nome da rua",'id="rua_pj"')}
      ${input("Número *","numero_pj","text","Número")}
      ${input("Complemento","complemento_pj","text","Apto, sala, etc.",'required=""')}
      ${input("Bairro *","bairro_pj","text","Bairro",'id="bairro_pj"')}
      ${input("Cidade *","cidade_pj","text","Cidade",'id="cidade_pj"')}
      ${input("Estado *","estado_pj","text","UF",'id="estado_pj" maxlength="2"')}

      <div class="md:col-span-2 mt-4 pt-4 border-t-2 border-[#00D9A3]/20">
        <h3 class="text-xl font-bold text-[#0A2F3F] mb-4 flex items-center gap-2">
          <div class="w-1 h-6 bg-gradient-to-b from-[#00D9A3] to-[#00F5B8] rounded-full"></div>
          Dados do Representante Legal
        </h3>
      </div>

      ${input("Nome Completo do Representante *","nome_completo_rep","text","Digite o nome completo")}
      ${input("CPF do Representante Legal *","cpf_representante","text","000.000.000-00",'oninput="maskCPF(this)" maxlength="14"')}
      ${input("Data de Nascimento do Representante *","data_nascimento_rep","date")}
      ${input("Nome da Mãe do Representante *","nome_mae_rep","text","Digite a nome da mãe")}
      ${input("Telefone / Celular *","telefone_pj","tel","(00) 00000-0000",'oninput="maskPhone(this)" maxlength="15"')}
      ${input("E-mail *","email_pj","email","email@exemplo.com")}
    </div>
  `;
}

function input(label, name, type="text", placeholder="", extraAttrs="") {
  return `
    <div class="space-y-2">
      <label class="block text-[#0A2F3F] font-semibold text-sm">${label}</label>
      <input type="${type}" name="${name}" required ${extraAttrs}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D9A3] focus:border-transparent"
        placeholder="${placeholder}">
    </div>
  `;
}

async function buscarCEP(cep, tipo) {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado!");
      return;
    }

    document.getElementById(`rua_${tipo}`).value = data.logradouro || "";
    document.getElementById(`bairro_${tipo}`).value = data.bairro || "";
    document.getElementById(`cidade_${tipo}`).value = data.localidade || "";
    document.getElementById(`estado_${tipo}`).value = data.uf || "";

    document.querySelector(`input[name="numero_${tipo}"]`)?.focus();
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    alert("Erro ao buscar CEP. Tente novamente.");
  }
}

function maskCPF(input) {
  let v = input.value.replace(/\D/g, "");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  input.value = v;
}
function maskCNPJ(input) {
  let v = input.value.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  input.value = v;
}
function maskPhone(input) {
  let v = input.value.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  input.value = v;
}
function maskCEP(input) {
  let v = input.value.replace(/\D/g, "");
  v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  input.value = v;
}

function mapFormDataToEmailTemplate(data) {
  const isPJ = data.tipo_pessoa === 'juridica';
  const isPF = data.tipo_pessoa === 'fisica';

  const prefix = isPJ ? 'pj' : 'pf';
  const rua = data[`rua_${prefix}`] || '';
  const numero = data[`numero_${prefix}`] || '';
  const complemento = data[`complemento_${prefix}`] || '';
  const bairro = data[`bairro_${prefix}`] || '';
  const cidade = data[`cidade_${prefix}`] || '';
  const estado = data[`estado_${prefix}`] || '';
  const cep = data[`cep_${prefix}`] || '';

  return {
    tipo_pessoa: data.tipo_pessoa,
    is_pf: isPF,
    is_pj: isPJ,
    razao_social: data.razao_social || '',
    nome_fantasia: data.nome_fantasia_pj || data.nome_fantasia || '',
    cnpj: data.cnpj || '',
    data_fundacao: data.data_fundacao || '',
    nome_completo: data.nome_completo || data.nome_completo_rep || '',
    cpf: data.cpf || data.cpf_representante || '',
    data_nascimento: data.data_nascimento || data.data_nascimento_rep || '',
    email: data.email || data.email_pj || '',
    telefone: data.telefone || data.telefone_pj || '',
    cep,
    rua,
    numero,
    complemento,
    bairro,
    cidade,
    estado
  };
}

// Exponha as funções para o escopo global para uso no HTML inline
window.selecionarTipo = selecionarTipo;
window.voltarSelecao = voltarSelecao;
window.handleSubmit = handleSubmit;
window.buscarCEP = buscarCEP;
window.maskCPF = maskCPF;
window.maskCNPJ = maskCNPJ;
window.maskPhone = maskPhone;
window.maskCEP = maskCEP;
