window.addEventListener("load", async () => {
  const switched = document.querySelector(".content .header .switch");

  switched.addEventListener("click", function (e) {
    e.preventDefault();

    document.body.classList.toggle("theme-dark");
  });

  setInterval(() => {
    const width = window.innerWidth;
    if (width <= 480) {
      console.log("width is less than 480");
      const sidebar = document.querySelector(".sidebar");
      sidebar.classList.add("sidebar-short");
    }
  }, 4000);

  const showBtn = document.querySelector(".show span");
  const sidebar = document.querySelector(".sidebar");

  showBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sidebar.classList.remove("sidebar-short");
    sidebar.classList.toggle("sidebar-full");
  });

  const backdrop = document.getElementById("backdrop");
  const addEmployeeModal = document.getElementById("add-modal");
  const cancelAddEmployeeBtn = addEmployeeModal.querySelector(".btn--passive");
  const addEmployeeBtn = document.querySelector("header button");

  // Fn toggling backdrop's visibility
  const toggleBackdrop = () => {
    backdrop.classList.toggle("visible");
  };

  // opening Add Employee modal
  const showEmployeeModal = () => {
    addEmployeeModal.classList.add("visible");
    toggleBackdrop();
  };

  //open Add movie modal if User clicks on Add movie btn
  addEmployeeBtn.addEventListener("click", showEmployeeModal);

  // Closing add-employee modal
  const closeEmployeeModal = () => {
    toggleBackdrop();
    addEmployeeModal.classList.remove("visible");
  };

  //Close Add employee modal if User clicks on backdrop
  backdrop.addEventListener("click", closeEmployeeModal);

  // Close Add employee modal if User clicks on Cancel btn
  cancelAddEmployeeBtn.addEventListener("click", closeEmployeeModal);

  // fetch request to get all employees
  const result = await fetch("http://localhost:7070/api/employees");
  const response = await result.json();
  // console.log(response);

  // create the employee table
  const tbody = document.querySelector("tbody");
  let tableContent = "";

  response.forEach((user) => {
    tableContent += `
      <tr>
      <td scope="row">${user.name}</td>
      <td>${user.email}</td>
      <td>${user.job_title}</td>
      <td>
          <div class="action">
              <span class="material-symbols-outlined edit" edit-id="${user.id}">
                  edit
              </span>
              <span class="material-symbols-outlined delete" delete-id="${user.id}">
                  delete
              </span>
          </div>
      </td>
  </tr>
      `;
    tbody.innerHTML = tableContent;
  });

  // button to create employee in the modal
  const createEmployee = document.querySelector("button.addBtn");
  createEmployee.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.querySelector("input#name").value;
    const email = document.querySelector("input#email").value;
    const job_title = document.querySelector("input#title").value;
    const error = document.querySelector(".error");
    const message = document.querySelector(".error .error-message");

    if (
      email == "" ||
      email == null ||
      name == "" ||
      name == null ||
      job_title == "" ||
      job_title == null
    ) {
      error.style.display = "block";
      message.textContent = "Please fill all fields";
      message.style.color = "red";

      // remove error message after 3 seconds
      setTimeout(() => {
        error.style.display = "none";
      }, 3000);

      return;
    } else {
      const confirmed = confirm(
        "Are you sure you want to create a new employee?"
      );

      if (confirmed) {
        // post request to create employee
        const result = await fetch("http://localhost:7070/api/employee", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            job_title: job_title,
          }),
        });

        //check http status
        if (result.status != 201) {
          const response = await result.json();

          error.style.display = "block";
          message.textContent = response.message;
          // remove error message after 3 seconds
          setTimeout(() => {
            error.style.display = "none";
          }, 3000);

          return;
        }
        if (result.status == 201) {
          const response = await result.json();
          console.log(response);

          // create the employee table
          const tbody = document.querySelector("tbody");
          let tContents = "";
          tContents += `
            <tr>
            <td scope="row">${name}</td>
            <td>${email}</td>
            <td>${job_title}</td>
            <td>
            <div class="action">
            <span class="material-symbols-outlined edit">
              edit
            </span>
            <span class="material-symbols-outlined delete">
              delete
            </span>
            </div>
            </td>
            </tr>
            `;
          tbody.innerHTML = tContents;
          window.location.href = window.location.href;
        }
      }
    }
  });

  // delete employee
  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async (e) => {
      const employeeId = deleteBtn.getAttribute("delete-id");

      try {
        let confirmed = confirm(
          `Are you sure you want to delete employee ${employeeId}`
        );

        // fetch request to delete employee
        if (confirmed === true) {
          const result = await fetch(
            `http://localhost:7070/api/employee/${employeeId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          await result.json();
          if (result.status === 200 || result.status === 201) {
            console.log("Deleted successfully");

            window.location.href = "./dashboard.html";
          }
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  // fetch a single user
  const allEditBtns = document.querySelectorAll(".edit");

  allEditBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", async () => {
      const employeeId = editBtn.getAttribute("edit-id");

      try {
        const result = await fetch(
          `http://localhost:7070/api/employee/${employeeId}`
        );
        const response = await result.json();
        console.log("edit data ", response);
        showEmployeeModal();

        document.querySelector("#name").value = response.name;
        document.querySelector("#email").value = response.email;
        document.querySelector("#title").value = response.job_title;
        document.querySelector("button.addBtn").style.display = "none";
        document.querySelector("button.editBtn").style.display = "block";
      } catch (error) {
        console.log(error);
      }
    });
  });

  const updateEmployee = document.querySelector("button.editBtn");

  updateEmployee.addEventListener("click", async (e) => {
    e.preventDefault();

    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let job_title = document.querySelector("#title").value;
    // const employeeId = editBtn.getAttribute("edit-id");
    const employeeId = document.querySelector(".edit").getAttribute("edit-id");

    const confirmation = confirm("Are you sure you want to update employee");

    // fetch request to update employee
    if (confirmation) {
      const result = await fetch(
        `http://localhost:7070/api/employee/${employeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            job_title: job_title,
          }),
        }
      );
      if (result.status == 200 || result.status == 201) {
        window.location.href = "./dashboard.html";
      }
    }
  });
});
