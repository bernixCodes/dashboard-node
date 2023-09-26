window.addEventListener("load", () => {
  const signUp = document.querySelector(".sign-up");

  signUp.addEventListener("click", async (e) => {
    e.preventDefault();
    username = document.querySelector("#name");
    email = document.querySelector("#email");
    password = document.querySelector("#password");
    passwordConfirm = document.querySelector("#password_confirm");
    error = document.querySelector(".error");
    errorMessage = document.querySelector(".error-message");

    if (password.value != passwordConfirm.value) {
     
      error.style.display = "block";
      errorMessage.textContent = "Passwords do not match";
      setTimeout(() => {
        error.style.display = "none";
        errorMessage.textContent = "";
      }, 3000);
      return;
    }

    try {
      result = await fetch(`http://localhost:7070/api/user`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username.value,
          password: password.value,
          email: email.value,
        }),
      });
      console.log(result);

      if (result.status != 200 || result.status != 201) {
        res = await result.json();
        console.log(res);

        setTimeout(() => {
          error.remove();
        }, 3000);

        window.location.href = "./dashboard.html";
      }
    } catch (error) {
      console.log(error);
    }
  });
});
