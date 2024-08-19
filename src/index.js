// import jsonData from "./data.json" assert { type: "json" };
// const jsonData = require("./data.json");
// const jsonData = require("./data.json");
console.log("Hello");
(function () {
	fetch("./data.json")
		.then((response) => response.json())
		.then((data) => {
			let employees = data;
			let selectedEmployeeId = employees[0].id;
			let selectedEmployee = employees[0];

			const employeeList = document.querySelector(
				".employees__names--list"
			);
			const employeeInfo = document.querySelector(
				".employees__names--info"
			);

			const createEmployee = document.querySelector(".createEmployee");
			const addEmployeeModal = document.querySelector(".addEmployee");
			const addEmployeeForm = document.querySelector(
				".addEmployee_create"
			);

			createEmployee.addEventListener("click", () => {
				addEmployeeModal.style.display = "flex";
				const addHeader = document.querySelector(".addEmployee_header");
				addHeader.innerHTML =
					'<span class="add">Add a new Employee</span>';
			});

			addEmployeeModal.addEventListener("click", (e) => {
				if (e.target.className === "addEmployee") {
					addEmployeeModal.style.display = "none";
				}
			});

			const dobInpt = document.querySelector(".addEmployee_create--dob");
			dobInpt.max = `${new Date().getFullYear() - 18}-${new Date()
				.toISOString()
				.slice(5, 10)}`;
			addEmployeeForm.addEventListener("submit", (e) => {
				e.preventDefault();
				const formType = document.querySelector(".addEmployee_header")
					.children[0].classList.value;
				const formData = new FormData(addEmployeeForm);
				const values = [...formData.entries()];
				let empData = {};
				values.forEach((val) => {
					empData[val[0]] = val[1];
				});

				if (formType === "add")
					empData.id = employees[employees.length - 1].id + 1;
				empData.age =
					new Date().getFullYear() -
					parseInt(empData.dob.slice(0, 4), 10);
				empData.imageUrl =
					empData.imageUrl ||
					"https://cdn-icons-png.flaticon.com/512/0/93.png";
				if (formType === "add") employees.push(empData);
				else {
					employees.forEach((emp) => {
						if (emp.id === parseInt(selectedEmployeeId, 10)) {
							emp.firstName = empData.firstName;
							emp.lastName = empData.lastName;
							emp.email = empData.email;
							emp.contactNumber = empData.contactNumber;
							emp.age = empData.age;
							emp.dob = empData.dob;
							emp.salary = empData.salary;
							emp.address = empData.address;
						}
					});
				}

				renderEmployees();
				addEmployeeForm.reset();
				addEmployeeModal.style.display = "none";
			});

			employeeList.addEventListener("click", (e) => {
				if (
					e.target.tagName === "SPAN" &&
					selectedEmployeeId !== e.target.id
				) {
					selectedEmployeeId = e.target.id;
					renderEmployees();
					renderSingleEmployee();
				}
				if (e.target.tagName === "I") {
					employees = employees.filter(
						(emp) => String(emp.id) !== e.target.parentNode.id
					);

					if (String(selectedEmployeeId) === e.target.parentNode.id) {
						selectedEmployeeId = employees[0]?.id || -1;
						selectedEmployee = employees[0] || {};
						renderSingleEmployee();
					}
					renderEmployees();
				}
			});

			const renderEmployees = () => {
				employeeList.innerHTML = "";
				employees.forEach((emp) => {
					const employee = document.createElement("span");
					employee.classList.add("employees__name--item");

					if (parseInt(selectedEmployeeId, 10) === emp.id) {
						employee.classList.add("selected");
						selectedEmployee = emp;
					}

					employee.setAttribute("id", emp.id);
					employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;

					employeeList.append(employee);
				});
			};

			const renderSingleEmployee = () => {
				if (selectedEmployeeId === -1) {
					employeeInfo.innerHTML = "";
					return;
				}
				employeeInfo.innerHTML = `
				<div class="editEmployee--container"><button class="editEmployee">Edit Employee</button></div>
				<img class="employees__single--image" src="${selectedEmployee.imageUrl}"/>
				<span class="employees__single--heading">
				${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
				</span>
				<span>${selectedEmployee.address}</span>
				<span>${selectedEmployee.email}</span>
				<span>Mobile - ${selectedEmployee.contactNumber}</span>
				<span>DOB - ${selectedEmployee.dob}</span>`;
				const addHeader = document.querySelector(".addEmployee_header");
				const editEmployee = document.querySelector(".editEmployee");
				addHeader.innerHTML =
					'<span class="edit">Edit Employee Details</span>';
				editEmployee.addEventListener("click", () => {
					addEmployeeModal.style.display = "flex";
					console.log(addEmployeeForm);
					addEmployeeForm.querySelector(
						".addEmployee_create--firstName"
					).value = selectedEmployee.firstName;
					addEmployeeForm.querySelector(
						".addEmployee_create--lastName"
					).value = selectedEmployee.lastName;
					addEmployeeForm.querySelector(
						".addEmployee_create--email"
					).value = selectedEmployee.email;
					addEmployeeForm.querySelector(
						".addEmployee_create--contact"
					).value = selectedEmployee.contactNumber;
					addEmployeeForm.querySelector(
						".addEmployee_create--salary"
					).value = selectedEmployee.salary;
					addEmployeeForm.querySelector(
						".addEmployee_create--address"
					).value = selectedEmployee.address;
					let dob = selectedEmployee.dob.split("/");
					addEmployeeForm.querySelector(
						".addEmployee_create--dob"
					).value =
						dob.length > 1 ? `${dob[2]}-${dob[1]}-${dob[0]}` : dob;
				});
			};
			if (selectedEmployee) renderSingleEmployee();

			renderEmployees();
		})
		.catch((error) => console.error("Error loading JSON file", error));
})();
