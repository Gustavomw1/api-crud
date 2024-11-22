const API_URL = "http://localhost:3000";

// Função para cadastrar usuário
async function registerUser() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document
    .getElementById("confirmar-senha")
    .value.trim();

  // Verifica se os campos estão preenchidos
  if (!email || !senha || !confirmarSenha) {
    showMessage("Por favor, preencha todos os campos!", "error");
    return;
  }

  // Verifica se as senhas coincidem
  if (senha !== confirmarSenha) {
    showMessage(
      "As senhas não coincidem. Verifique e tente novamente.",
      "error"
    );
    return;
  }

  //Cadastrar
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Usuário criado com sucesso! Redirecionando...", "success");

      setTimeout(() => {
        window.location.href = "../logar/index2.html";
      }, 2000);
    } else {
      showMessage(data.mensagem || "Erro ao cadastrar usuário.", "error");
    }
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    showMessage(
      "Erro ao cadastrar usuário. Tente novamente mais tarde.",
      "error"
    );
  }
}

// Exibir mensagens no messageBox
function showMessage(message, type) {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.style.display = "block";
  messageBox.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336";

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}
