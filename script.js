let status = true; // true = submit mode, false = edit mode
let lastId = localStorage.getItem("lastId")
  ? parseInt(localStorage.getItem("lastId"))
  : 0; // Get last used ID from localStorage
let objLastId = 0; // Store ID of the record being edited
let arr = localStorage.getItem("arr")
  ? JSON.parse(localStorage.getItem("arr"))
  : []; // Get existing data from localStorage

// Show "No data" message if table is empty
function checkEmptyTable() {
  const table = document.getElementById("table");
  if (arr.length === 0) {
    table.innerHTML = `
        <tr>
            <td colspan="5" class="no-data text-center p-8 text-[#777] italic">
                No student records found. Add a new student to get started.
            </td>
        </tr>
    `;
    lastId = 0;
    localStorage.setItem("lastId", lastId);
    return true;
  }
  return false;
}

checkEmptyTable(); // Initial check on page load

// Load data when page is loaded
function loadData() {
  tableInsert();
}

window.addEventListener("DOMContentLoaded", loadData);

// Add or update student record
function submit() {
  status = true;

  let name = document.querySelector("#name").value;
  let roll = document.querySelector("#roll").value;
  let dep = document.querySelector("#dep").value;

  // Check for empty input fields
  if (!name || !roll || !dep) {
    alert("Please fill all fields.");
    return;
  }

  // Add new record
  if (document.querySelector("#submit-text").textContent === "Submit") {
    lastId++;
    let obj = {
      lastId: lastId,
      name: name,
      roll: roll,
      dep: dep,
    };

    arr.push(obj);
    localStorage.setItem("lastId", lastId);
  } else {
    // Update existing record
    update(objLastId);
  }

  localStorage.setItem("arr", JSON.stringify(arr));
  tableInsert();
  document.querySelector("#submit-text").textContent = status ? "Submit" : "update";
}

// Display all records in the table
function tableInsert() {
  let table = document.querySelector("#table");
  table.innerHTML = arr
    .map(
      (obj) =>
        `
            <tr class="hover:bg-[#f8f9ff]">
                <td class="p-4 text-center border-b border-[#eee]">${obj.lastId}</td>                    
                <td class="p-4 text-center border-b border-[#eee]">${obj.name}</td>
                <td class="p-4 text-center border-b border-[#eee]">${obj.roll}</td>
                <td class="p-4 text-center border-b border-[#eee]">${obj.dep}</td>
                <td class="p-4 text-center border-b border-[#eee] ">
                    <div class="flex justify-center gap-2">
                        <button onclick="edit(${obj.lastId})" class="bg-[#ff9800] text-white py-2 px-4 rounded-sm hover:bg-[#f57c00]">Edit</button>
                        <button onclick="deleteS(${obj.lastId})" class="bg-[#f44226] text-white rounded-sm border-none py-2 px-4 hover:bg-[#d32f2f]">Delete</button>
                     </div>
                </td>
            </tr>
        `
    )
    .join("");

  // Clear input fields
  document.querySelector("#name").value = "";
  document.querySelector("#roll").value = "";
  document.querySelector("#dep").value = "";

  checkEmptyTable();
}

// Load selected data into form for editing
function edit(lastId) {
  status = false;
  document.querySelector("#submit-text").textContent = "update";
  objLastId = lastId;

  let obj = arr.find((item) => item.lastId === lastId);
  document.querySelector("#name").value = obj.name;
  document.querySelector("#roll").value = obj.roll;
  document.querySelector("#dep").value = obj.dep;
}

// Update record with new values
function update(lastId) {
  let name = document.querySelector("#name").value;
  let roll = document.querySelector("#roll").value;
  let dep = document.querySelector("#dep").value;

  let updateObj = {
    lastId: lastId,
    name: name,
    roll: roll,
    dep: dep,
  };

  arr = arr.map((item) => (item.lastId === lastId ? updateObj : item));
  localStorage.setItem("arr", JSON.stringify(arr));

  tableInsert();
}

// Delete selected record
function deleteS(id) {
  arr = arr.filter((obj) => obj.lastId !== id);
  localStorage.setItem("arr", JSON.stringify(arr));

  // Update lastId if records still exist
  if (arr.length > 0) {
    lastId = arr[arr.length - 1].lastId;
    localStorage.setItem("lastId", lastId);
  }

  tableInsert();
  checkEmptyTable();
}
