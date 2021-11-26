const cpf = document.getElementById("cpf");
const voteButton = document.getElementById("vote-button");
const voteName = document.getElementById("vote-name");
const voteCancel = document.getElementById("vote-cancel");
const invalid = document.getElementById("invalid");

const captchaEnabled = voteButton.classList.contains("g-recaptcha");

VMasker(cpf).maskPattern("999.999.999-99");

export class Vote {
  constructor(modal) {
    this.modal = modal;
    this.error = false;

    cpf.addEventListener("input", () => this.updateCPF());
    voteCancel.addEventListener("click", () => this.close());
  }

  open(id, name) {
    this.id = id;
    voteName.innerText = name;
    document.body.classList.add("vote");
  }

  updateCPF() {
    voteButton.disabled = true;

    if (this.error) {
      this.error = false;
      invalid.innerText = "";
    }

    const cpfVal = cpf.value.replace(/\D/g, "");

    if (cpfVal.length >= 11) {
      if (CPF.validate(cpfVal)) {
        voteButton.disabled = false;
      } else {
        invalid.innerText = "CPF inválido";
        this.error = true;
      }
    }
  }

  reset() {
    invalid.innerText = "";
    cpf.value = "";
    this.error = false;
    voteButton.disabled = true;
  }

  async vote(token) {
    if (captchaEnabled && !window.recaptcha) {
      invalid.innerText = "Captcha não carregado.";
      return;
    }

    try {
      const res = await fetch("/votar", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          cpf: cpf.value,
          id: this.id,
          token,
        }),
      });

      if (res.status === 201) {
        this.modal.open("SUCESSO", "Você votou com sucesso.");
      } else {
        const { error } = await res.json();
        this.modal.open("ERRO", error || "Erro desconhecido.");
      }
    } catch {
      this.modal.open("ERRO", "Erro desconhecido.");
    }

    if (window.grecaptcha) {
      grecaptcha.reset();
    }

    this.reset();
  }

  close() {
    document.body.classList.remove("vote");
  }
}
