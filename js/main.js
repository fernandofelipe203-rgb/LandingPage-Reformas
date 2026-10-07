// ===== CONFIGURAÇÃO (troque aqui) =====
// Número do WhatsApp do prestador: código do país + DDD + número, só dígitos.
const WHATSAPP = "5511999999999";

// ===== Elementos =====
const passos = document.querySelectorAll(".passo");
const btnProx = document.getElementById("btnProx");
const btnVoltar = document.getElementById("btnVoltar");
const barra = document.getElementById("barra");
const info = document.getElementById("passoInfo");
const erro = document.getElementById("erro");
let atual = 1;

// Monta o link do WhatsApp com a mensagem
function linkWhats(texto) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
}

// Mostra o passo certo e atualiza barra de progresso
function mostrarPasso(n) {
  atual = n;
  passos.forEach(p => p.classList.toggle("ativo", Number(p.dataset.passo) === n));
  barra.style.width = (n / 3 * 100) + "%";
  info.textContent = "Passo " + n + " de 3";
  btnVoltar.hidden = n === 1;
  btnProx.textContent = n === 3 ? "Receber orçamento no WhatsApp" : "Continuar";
  erro.textContent = "";
}

// Valida o passo atual antes de avançar
function validar() {
  if (atual === 1 && !document.querySelector('input[name="servico"]:checked')) {
    erro.textContent = "Marque pelo menos um serviço para continuar.";
    return false;
  }
  if (atual === 2 && document.getElementById("local").value.trim() === "") {
    erro.textContent = "Informe o bairro e a cidade da obra.";
    return false;
  }
  if (atual === 3 && document.getElementById("nome").value.trim() === "") {
    erro.textContent = "Informe seu nome para começarmos a conversa.";
    return false;
  }
  return true;
}

// Monta a mensagem final e abre o WhatsApp
function enviarWhats() {
  const servicos = [...document.querySelectorAll('input[name="servico"]:checked')].map(i => i.value).join(", ");
  const msg =
    "Olá! Meu nome é " + document.getElementById("nome").value.trim() + ".\n" +
    "Gostaria de um orçamento para: " + servicos + ".\n" +
    "Local: " + document.getElementById("local").value.trim() + " (" + document.getElementById("imovel").value + ").\n" +
    "Prazo para começar: " + document.getElementById("prazo").value + ".";
  window.open(linkWhats(msg), "_blank", "noopener");
}

btnProx.addEventListener("click", () => {
  if (!validar()) return;
  atual < 3 ? mostrarPasso(atual + 1) : enviarWhats();
});
btnVoltar.addEventListener("click", () => mostrarPasso(atual - 1));
document.getElementById("formOrc").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); btnProx.click(); }
});

// Botões "Orçar X" nos serviços já marcam a opção no formulário
document.querySelectorAll("[data-servico]").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll('input[name="servico"]').forEach(i => { i.checked = i.value === link.dataset.servico; });
    mostrarPasso(1);
  });
});

// Botão flutuante e ano do rodapé
document.getElementById("waFlutuante").href = linkWhats("Olá! Vim pelo site e gostaria de um orçamento.");
document.getElementById("ano").textContent = new Date().getFullYear();
