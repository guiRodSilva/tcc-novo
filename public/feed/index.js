const input = document.querySelector("#pesquisar")
const logo = document.querySelector(".logo")
const icones = document.querySelector(".perfil-icones")
const abrirInput = document.querySelector(".buscar")
const fecharInput = document.querySelector(".fechar-input")

abrirInput.addEventListener("click", () =>{
    input.classList.add("active")
    logo.classList.add("remove")
    icones.classList.add("remove")
    fecharInput.classList.add("active")
} )

fecharInput.addEventListener("click", () =>{
    input.classList.remove("active")
    logo.classList.remove("remove")
    icones.classList.remove("remove")
    fecharInput.classList.remove("active")
})