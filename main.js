console.log("DB no main:", window.db);
// =============== CONFIGURAÇÕES ===============
const SENHA_PROF = "1234";

// ============ ABRIR TURMA =========== //
function abrirTurma(nomeArquivo) {
window.location.href = nomeArquivo;
}

// ============ LOGIN =============== //
function fazerLogin() {
const usuario = document.getElementById('usuario').value;
const senha = document.getElementById('senha').value;

if (usuario === 'admin' && senha === '1234') {
window.location.href = "menu.html";
} else {
alert("Usuário ou senha incorretos!");
}
}

// =========================================================
// ===============   INÍCIO DO SISTEMA   ===================
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

// --- fallback seguro para o botão Selecionar Minha Matéria ---
const btnSel = document.getElementById("btnSelecionarMateria") || document.querySelector('button[onclick="abrirPainelMateria()"]');
if (btnSel) {
btnSel.addEventListener("click", (e) => {
e.preventDefault();
// se a função global existir, chama; se não, abre direto
if (typeof abrirPainelMateria === "function") {
try { abrirPainelMateria(); return; } catch(e){ console.warn('abrirPainelMateria erro', e); }
}
const painel = document.getElementById("painelMateria");
if (painel) painel.style.display = painel.style.display === "block" ? "none" : "block";
});
} else {
console.warn("Botão Selecionar Minha Matéria não encontrado");
}

let modoProfessor = false;
let corSelecionada = null;

const celulas = document.querySelectorAll(".editavel");
const botoesPainel = document.querySelectorAll(".painel-botoes button");
const mensagem = document.getElementById("mensagem");

// ==================== SENHA ======================
const senha = prompt("Digite a senha para editar (ou Cancelar para modo aluno):");

if (senha === SENHA_PROF) {
modoProfessor = true;
if (mensagem) mensagem.innerText = "Modo Edição (PROFESSOR)";
botoesPainel.forEach(b => b.disabled = false);
} else {
modoProfessor = false;
if (mensagem) mensagem.innerText = "Modo Visualização (ALUNO)";
botoesPainel.forEach(b => b.disabled = true);
}

// ==================== CARREGAR CORES E TEXTOS ======================
celulas.forEach((cell) => {

const id = cell.dataset.id; // usa o data-id como chave única

// Texto
const textoSalvo = localStorage.getItem(id + "_texto");
if (textoSalvo !== null) cell.textContent = textoSalvo;

// Cor
const corFundo = localStorage.getItem(id + "_bg");
const corTexto = localStorage.getItem(id + "_txt");

if (corFundo !== null) cell.style.backgroundColor = corFundo;
if (corTexto !== null) cell.style.color = corTexto;

});

// ==================== SELECIONAR COR ======================
botoesPainel.forEach(btn => {
btn.addEventListener("click", () => {
if (!modoProfessor) return;
corSelecionada = btn.getAttribute("data-cor");
});
});

// ==================== PINTAR CÉLULAS ======================
celulas.forEach(cell => {
cell.addEventListener("click", () => {
if (!modoProfessor) return;
if (!corSelecionada) return;

const id = cell.dataset.id;

let bg = "";
let txt = "";

if (corSelecionada === "vermelho") {
bg = "#ff6b6b";
txt = "white";
}
else if (corSelecionada === "amarelo") {
bg = "#ffe66d";
txt = "black";
}
else if (corSelecionada === "nenhum") {
bg = "";
txt = "";
}

// aplica
cell.style.backgroundColor = bg;
cell.style.color = txt;

// salva / remove
if (corSelecionada === "nenhum") {
localStorage.removeItem(id + "_bg");
localStorage.removeItem(id + "_txt");
} else {
localStorage.setItem(id + "_bg", bg);
localStorage.setItem(id + "_txt", txt);
}
});

});

// ==================== EDITAR TEXTO ======================
celulas.forEach(cell => {
cell.addEventListener("dblclick", () => {
if (!modoProfessor) return;

const id = cell.dataset.id;
const original = cell.textContent;

const input = document.createElement("input");
input.type = "text";
input.value = original;
input.style.width = "100%";

cell.textContent = "";
cell.appendChild(input);
input.focus();

input.addEventListener("blur", () => {
const novoTexto = input.value;
cell.textContent = novoTexto;
localStorage.setItem(id + "_texto", novoTexto);
});

input.addEventListener("keydown", (e) => {
if (e.key === "Enter") input.blur();
});

});

});

// ==================== BLOQUEAR ALUNO ======================
if (!modoProfessor) {
celulas.forEach(cell => {
cell.style.pointerEvents = "none";
});
}
});
window.db.ref("teste").set("funcionando!");

window.db.ref("teste").on("value", snap => {
console.log("Leitura Firebase:", snap.val());
});