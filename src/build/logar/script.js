const API_URL = "http://localhost:3000";

// Função para realizar login do usuário
async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // Verifica se os campos estão preenchidos
  if (!email || !senha) {
    showMessage("Por favor, preencha todos os campos!", "error");
    return;
  }

  //logar
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Login realizado com sucesso! Redirecionando...", "success");

      setTimeout(() => {
        window.location.href = "";
      }, 2000);
    } else {
      showMessage(
        data.mensagem || "Erro ao realizar login. Tente novamente.",
        "error"
      );
    }
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    showMessage("Erro ao realizar login. Tente novamente mais tarde.", "error");
  }
}

// Função para exibir mensagens no messageBox
function showMessage(message, type) {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.style.display = "block";
  messageBox.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336";

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}
