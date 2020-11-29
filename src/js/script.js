// Global var that stores timeouts. Used in showMessage().
let globalTimeout;


/* PERSONNEL CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Personnel {

  static personnel = [];
  static currentlySelectedId = null;

  // Used when enabling or disabling EDIT tab save changes button.
  static selectedPersonFirstName = null;
  static selectedPersonLastName = null;
  static selectedPersonEmail = null;
  static selectedPersonJobTitle = null;
  static selectedPersonDepartment = null;

  // Return array of all personnel rows
  static async getAllPersonnel() {
    try {
      const res = await fetch("php/getAllPersonnel.php");
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        Personnel.personnel = resJson.data;
        console.log("Successfully retrieved personnel!");
        return true;
      } else {
        console.log("Failed to retrieve personnel!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  // Add personnal row
  static async addPersonnel(firstName, lastName, jobTitle, email, departmentId) {
    try {
      const res = await fetch("php/addPersonnel.php", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          jobTitle,
          email,
          departmentId
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        console.log("Successfull add!");
        return true;
      } else {
        console.log("Failed to add!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  // Update existing personnnel row by ID
  static async updatePersonnel(firstName, lastName, jobTitle, email, departmentId, id) {
    try {
      const res = await fetch("php/updatePersonnel.php", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          jobTitle,
          email,
          departmentId,
          id
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        // Edits person in array. This saves a request to the database.
        const personIndex = Personnel.personnel.findIndex(person => person.id === id);
        Personnel.personnel[personIndex]["firstName"] = firstName;
        Personnel.personnel[personIndex]["lastName"] = lastName;
        Personnel.personnel[personIndex]["jobTitle"] = jobTitle;
        Personnel.personnel[personIndex]["email"] = email;
        Personnel.personnel[personIndex]["departmentID"] = departmentId;
        return true;
      } else {
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  // Delete personnel row by ID
  static async deletePersonnel(id) {
    try {
      const res = await fetch("php/deletePersonnel.php", {
        method: "POST",
        body: JSON.stringify({
          id
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        // Removes person from array.
        const personIndex = Personnel.personnel.findIndex(person => person.id === id);
        Personnel.personnel.splice(personIndex, 1);
        return true;
      } else {
        console.log("Delete failed!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  static getPersonById(id) {
    return Personnel.personnel.find(person => person.id === id);
  }

  static async populateSearchResults() {
    $(".card-container").html("");
    $(".table-container").html("");

    Personnel.personnel.forEach(person => {
      const department = Department.getDepartmentById(person.departmentID);
      const location = Location.getLocationById(department.locationID);
      // CARDS
      $(".card-container").append(`
      <div class="person-card" data-id="${person.id}">
        <div class="card-info-group">
          <p class="card-data card-name">${person.firstName} ${person.lastName}</p>
          <p class="card-data card-email">${person.email}</p>
        </div>
        <div class="card-info-group">
          <p class="card-data card-job-title">${person.jobTitle}</p>
        </div>
        <div class="card-info-group">
          <p class="card-data card-department">${department ? department.name : "Unknown Department"}</p>
          <p class="card-data card-location">${location ? location.name : "Unknown Location"}</p>
        </div>
      </div>`);
      // ROWS
      $(".table-container").append(`
      <div class="person-row even" data-id="${person.id}">
        <div class="cell cell-name b-right">${person.firstName} ${person.lastName}</div>
        <div class="cell cell-job-title b-right">${person.jobTitle}</div>
        <div class="cell cell-department b-right">${department ? department.name : "Unknown"}</div>
        <div class="cell cell-location">${location ? location.name : "Unknown"}</div>
      </div>`);
    });

    // Card Select Event listener
    $(".person-card, .person-row").on("click", e => {
      if (Personnel.currentlySelectedId === $(e.currentTarget).data("id").toString()) {
        Personnel.currentlySelectedId = null;
        deselectPerson();
        disableTabs();
      } else {
        Personnel.currentlySelectedId = $(e.currentTarget).data("id").toString();
        selectPerson(Personnel.currentlySelectedId);
        enableTabs();
      }
    });
  }
}



/* DEPARTMENT CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Department {

  static departments = [];
  static currentlySelectedId = null;

  // Used in Edit Departments Tab
  static selectedDepCurrentName = null;
  static selectedDepCurrentLoc = null;

  static async getAllDepartments() {
    try {
      const res = await fetch("php/getAllDepartments.php");
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        Department.departments = resJson.data;
        console.log("Successfully retrieved departments!");
        return true;
      } else {
        console.log("Failed to retrieve departments!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  static async addDepartment(name, locationId) {
    try {
      const res = await fetch("php/addDepartment.php", {
        method: "POST",
        body: JSON.stringify({
          name,
          locationId
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        console.log("Successfully added department!");
        return true;
      } else {
        console.log("Failed to add department!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  static async updateDepartment(name, locationId, id) {
    try {
      const res = await fetch("php/updateDepartment.php", {
        method: "POST",
        body: JSON.stringify({
          name,
          locationId,
          id
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        const depIndex = Department.departments.findIndex(dep => dep.id === id);
        Department.departments[depIndex]["name"] = name;
        Department.departments[depIndex]["locationID"] = locationId;
        return true;
      } else {
        console.log("Failed to update department!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  static async deleteDepartment(id) {
    try {
      const res = await fetch("php/deleteDepartment.php", {
        method: "POST",
        body: JSON.stringify({
          id
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        const depIndex = Department.departments.findIndex(dep => dep.id === id);
        Department.departments.splice(depIndex, 1);
        return true;
      } else {
        console.log("Delete failed!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  static getDepartmentById(id) {
    return Department.departments.find(dep => dep.id === id);
  }

  static getDepartmentByName(name) {
    return Department.departments.find(dep => dep.name === name);
  }

  static getHtmlOptions() {
    let locationOptionsString = '';
    Department.departments.forEach(dep => {
      locationOptionsString += 
      `<option data-department-id="${dep.id}" value="${dep.name}">${dep.name}</option>`;
    });
    return locationOptionsString;
  }
}



/* LOCATION CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Location {

  static locations = [];
  static currentlySelectedId = null;
  static currentlySelectedName = null;

  static async getAllLocations() {
    try {
      const res = await fetch("php/getAllLocations.php");
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        Location.locations = resJson.data;
        console.log("Successfully got locations!");
        return true;
      } else {
        console.log("Get all Locations failed!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  static async addLocation(name) {
    try {
      const res = await fetch("php/addLocation.php", {
        method: "POST",
        body: JSON.stringify({
          name
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        console.log("Successfully added location!");
        return true;
      } else {
        console.log("Failed to add location!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  // Update existing location in database
  static async updateLocation(name, id) {
    try {
      const res = await fetch("php/updateLocation.php", {
        method: "POST",
        body: JSON.stringify({
          name,
          id
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        const locIndex = Location.locations.findIndex(loc => loc.id === id);
        Location.locations[locIndex]["name"] = name;
        return true;
      } else {
        console.log("Update failed!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  // Delete location by ID
  static async deleteLocation(id) {
    try {
      const res = await fetch("php/deleteLocation.php", {
        method: "POST",
        body: JSON.stringify({
          id
        })
      });
      const resJson = await res.json();
      if (resJson["status"]["name"] === "ok") {
        const locIndex = Location.locations.findIndex(loc => loc.id === id);
        Location.locations.splice(locIndex, 1);
        return true;
      } else {
        console.log("Delete failed!");
        return false;
      }
    } catch(e) {
      return false;
    }
  }
  
  static getLocationById(id) {
    return Location.locations.find(loc => loc.id === id)
  }

  static getLocationByName(name) {
    return Location.locations.find(loc => loc.name === name);
  }

  static getHtmlOptions() {
    let locationOptionsString = "";
    Location.locations.forEach(loc => {
      locationOptionsString += `<option class="location-option" data-location-id="${loc.id}" value="${loc.name}">${loc.name}</option>`;
    });
    //console.log(locationOptionsString);
    return locationOptionsString;
  }
}




/* FUNCTIONS */
/*~~~~~~~~~~~*/

// Filters results, hiding results that do not match the filters.
function filterResults() {
  // setTimeout() is required to prevent a bug with name search box.
  setTimeout(() => {
    // Filter values
    const filterNameString = $("#name-filter").val().toLowerCase().trim();
    const filterDepString = $("#department-filter").val();
    const filterLocString = $("#location-filter").val();

    // Loop over all results.
    $(".person-card").each(function() {
      const $card = $(this);
      const $row = getRowById($card.data("id"));

      const cardDepartment = $card.find(".card-department").html();
      const cardLocation = $card.find(".card-location").html();
      const cardName = $card.find(".card-name").html();

      const depFilter = testDepartment(cardDepartment, filterDepString);
      if (depFilter) {
        $row.css("display", "none");
        $card.css("display", "none");
        return;
      };

      const locFilter = testLocation(cardLocation, filterLocString);
      if (locFilter) {
        $row .css("display", "none");
        $card.css("display", "none");
        return;
      };

      const nameFilter = testName(cardName, filterNameString);
      if (nameFilter) { 
        $row.css("display", "none");
        $card.css("display", "none");
        return;
      };
      // If card does not get flagged by the filter, set display to flex.
      $row.css("display", "flex");
      $card.css("display", "flex");
    });
    // Refresh counter after filtering,
    colourRows();
    updateShowingCounter();

  }, 0)
}

// These three return true if card is to be filtered, aka hidden.
function testDepartment(cardDepartment, filterDepartmentString) {
  if (filterDepartmentString === "All Departments") return false;
  if (filterDepartmentString === cardDepartment) return false;
  return true;
}

function testLocation(cardLocation, filterLocationString) {
  if (filterLocationString === "All Locations") return false;
  if (filterLocationString === cardLocation) return false;
  return true;
}

function testName(cardName, filterNameString) {
  if (cardName.toLowerCase().includes(filterNameString)) return false;
  return true;
}

// Updates the counter in Seach Results title bar.
function updateShowingCounter() {
  let total = 0, totalVisible = 0;
  $(".person-card").each(function() {
    if ($(this).css("display") === "flex") totalVisible++;
    total++;
  });
  $(".showing-count").html(totalVisible);
  $(".total-count").html(total);
}

// Colours rows after filtering.
function colourRows() {
  let counter = 0;
  $(".person-row").each(function() {
    if ($(this).css("display") === "none") {
      return;
    } else {
      if (counter % 2 === 0) {
        $(this).removeClass("odd");
        $(this).addClass("even");
      } else {
        $(this).removeClass("even");
        $(this).addClass("odd");
      }
      counter++;
    }
  });
}

// Populates location select elements.
function populateLocationSelects() {
  const standardLocOptions = Location.getHtmlOptions();
  const allLocsOption = '<option class="location-option" data-location-id="all">All Locations</option>';
  const newLocOption = '<option>NEW LOCATION</option>';
  const previousFilterLocationVal = $("#location-filter").val();
  const previousLocationChangeVal = $("#location-change").val();
  const previousLocationSelectVal = $("#location-select").val();

  $("#location-filter").html(allLocsOption + standardLocOptions);
  $("#location-filter").val(previousFilterLocationVal);
  if ($("#location-filter").val() === null) $("#location-filter").val("All Locations");

  $("#location-change").html(standardLocOptions);
  $("#location-change").val(previousLocationChangeVal);

  $("#location-select").html(newLocOption + standardLocOptions)
  $("#location-select").val(previousLocationSelectVal);
}

// Populates department select elements.
function populateDepartmentSelects() {
  const standardDepOptions = Department.getHtmlOptions();
  const allDepsOption = '<option data-department-id="all">All Departments</option>';
  const newDepOption = '<option>NEW DEPARTMENT</option>';

  const previousFilterDepartmentVal = $("#department-filter").val();
  const previousAddTabDepartmentVal = $("#add-department").val();
  const previousEditTabDepartmentVal = $("#edit-department").val();
  const previousSelectDepartmentVal = $("#department-select").val();

  $("#department-filter").html(allDepsOption + standardDepOptions);
  $("#department-filter").val(previousFilterDepartmentVal);
  if ($("#department-filter").val() === null) $("#department-filter").val("All Departments");

  $("#add-department").html(standardDepOptions);
  $("#add-department").val(previousAddTabDepartmentVal);

  $("#edit-department").html(standardDepOptions);
  $("#edit-department").val(previousEditTabDepartmentVal);

  $("#department-select").html(newDepOption + standardDepOptions);
  $("#department-select").val(previousSelectDepartmentVal);
}

// Switches between "main" tabs at top of app.
function changeMainTab(e) {
  const $tab = $(e.currentTarget);
  const $tabMenu = $(`.${$tab.html()}-menu`);
  if ($tab.hasClass("disabled")) return;
  if ($tab.hasClass("selected-tab")) {
    $tab.removeClass("selected-tab");
    $tabMenu.removeClass("selected-menu");
  } else {
    $tab.addClass("selected-tab");
    $tabMenu.addClass("selected-menu");
    $tab.siblings().removeClass("selected-tab");
    $tabMenu.siblings().removeClass("selected-menu");
  }
}

// Enables EDIT and DELETE tabs.
function enableTabs() {
  $(".edit-tab-text-input").attr("disabled", false);
  $(".edit-tab-select-input").attr("disabled", false);

  $(".delete-message").html("Are you sure you want to delete this entry?");
  $("#delete-entry").removeClass("disabled");
}

// Disables EDIT and DELETE tabs.
function disableTabs() {

  $(".edit-tab-text-input").attr("disabled", true);
  $(".edit-tab-select-input").attr("disabled", true);
  $("#save-changes").addClass("disabled");
  resetEditTab();

  $(".delete-message").html("Select an entry to delete it.");
  $(".delete-button").addClass("disabled");
}

// Switches between bottom tabs.
function changeBottomTab(e) {
  const $tab = $(e.currentTarget);
  const $bottomMenu = $(`.${$tab.html().replace(" ", "-")}-menu`);
  if ($tab.hasClass("selected-bottom-tab")) {
    $tab.removeClass("selected-bottom-tab");
    $bottomMenu.removeClass("selected-bottom-menu");
  } else {
    $tab.addClass("selected-bottom-tab");
    $tab.siblings().removeClass("selected-bottom-tab");
    $bottomMenu.addClass("selected-bottom-menu");
    $bottomMenu.siblings().removeClass("selected-bottom-menu");
  }
}

// Returns count of personnal in given department.
function checkIfDepartmentInUse(departmentId) {
  let counter = 0;
  Personnel.personnel.forEach(person => {
    if (person.departmentID === departmentId) counter++;
  });
  return counter;
}

// Returns count of departments in given location.
function checkIfLocationInUse(locationId) {
  let counter = 0;
  Department.departments.forEach(dep => {
    if (dep.locationID === locationId) counter++;
  });
  return counter;
}

// Resets filter and refreshes results.
function resetFilter() {
  $("#name-filter").val("");
  $("#department-filter").val("All Departments");
  $("#location-filter").val("All Locations");
  filterResults();
}

// Resets Edit Departments Tab fields.
function resetEditDepartments() {
  $("#department-select").val("NEW DEPARTMENT");
  $("#department-name").val("");
  $("#location-change").val(null);
  $("#save-department").addClass("disabled");
  $("#delete-department").addClass("disabled");
}

// Resets Edit Locations tab fields.
function resetEditLocations() {
  $("#location-select").val("NEW LOCATION");
  $("#location-name").val("");
  $("#save-location").addClass("disabled");
  $("#delete-location").addClass("disabled");
}

// Reset Add Tab Fields
function resetAddTab() {
  $(".add-tab-input").val("");
  $("#add-entry").addClass("disabled");
}

// Reset Edit Tab Fields
function resetEditTab() {
  $(".edit-tab-text-input").val("");
  $(".edit-tab-select-input").val(null);
}

// Selects Person Card and Row and fills out EDIT tab's fields.
function selectPerson(personnelId) {
  const $card = getCardById(personnelId);
  const $row = getRowById(personnelId);
  const personData = Personnel.getPersonById(Personnel.currentlySelectedId);
  const personDepartment = Department.getDepartmentById(personData.departmentID).name;
  $card.addClass("selected-card");
  $row.addClass("selected-row");
  $card.siblings().removeClass("selected-card");
  $row.siblings().removeClass("selected-row");
  $("#edit-first-name").val(personData.firstName);
  $("#edit-last-name").val(personData.lastName);
  $("#edit-email").val(personData.email);
  $("#edit-job-title").val(personData.jobTitle);
  $("#edit-department").val(personDepartment);
  Personnel.selectedPersonFirstName = personData.firstName.toLowerCase();
  Personnel.selectedPersonLastName = personData.lastName.toLowerCase();
  Personnel.selectedPersonEmail = personData.email.toLowerCase();
  Personnel.selectedPersonJobTitle = personData.jobTitle.toLowerCase();
  Personnel.selectedPersonDepartment = personDepartment.toLowerCase();
  checkEditTabDifferences();
}

// Checks to see if an edit has been made before enabling the save button.
function checkEditTabDifferences() {
  setTimeout(() => {
    // If FIRST or LAST name is EMPTY, DISABLE Save Changes Button.
    if ($("#edit-first-name").val().toLowerCase().trim() === "" || $("#edit-last-name").val().toLowerCase().trim() === "") {
      $("#save-changes").addClass("disabled");
    // ELSE IF all fields are the SAME as when the entry was first selected, DISABLE Save Changes Button.
    } else if ($("#edit-first-name").val().toLowerCase().trim() === Personnel.selectedPersonFirstName &&
      $("#edit-last-name").val().toLowerCase().trim() === Personnel.selectedPersonLastName &&
      $("#edit-email").val().toLowerCase().trim() === Personnel.selectedPersonEmail &&
      $("#edit-job-title").val().toLowerCase().trim() === Personnel.selectedPersonJobTitle &&
      $("#edit-department").val().toLowerCase() === Personnel.selectedPersonDepartment) {
      $("#save-changes").addClass("disabled");
    // Otherwise ENABLE Save Changes Button.
    } else {
      $("#save-changes").removeClass("disabled");
    }
  }, 0)
}

// Resets ADD Tab input fields.
function checkAddTabRequiredFields() {
  setTimeout(() => {
    if ($("#add-first-name").val().trim() !== "" &&
      $("#add-last-name").val().trim() !== "" &&
      $("#add-department").val() !== null) {
      $("#add-entry").removeClass("disabled");
    } else {
      $("#add-entry").addClass("disabled");
    }
  }, 0);
}

// Reselects the last selected peron.
function reselectPerson() {
  if (Personnel.currentlySelectedId === null) return;
  selectPerson(Personnel.currentlySelectedId);
}

// Returns card by personnel id.
function getCardById(personnelId) {
  return $(`.person-card[data-id="${personnelId}"`);
}

// Returns row by personnel id.
function getRowById(personnelId) {
  return $(`.person-row[data-id="${personnelId}"`);
}

// Deselects a person.
function deselectPerson() {
  $(".person-card").removeClass("selected-card");
  $(".person-row").removeClass("selected-row");
  $("#edit-first-name").val("");
  $("#edit-last-name").val("");
  $("#edit-email").val("");
  $("#edit-job-title").val("");
  $("#edit-department").val("");
}

// EDIT TAB - Save Changes
async function saveEditChanges() {
  const id = Personnel.currentlySelectedId;
  const fName = $("#edit-first-name").val().trim();
  const lName = $("#edit-last-name").val().trim();
  const email = $("#edit-email").val().trim();
  const jobTitle = $("#edit-job-title").val().trim();
  const departmentName = $("#edit-department").val();
  const departmentId = Department.getDepartmentByName(departmentName).id;

  const success = await Personnel.updatePersonnel(fName, lName, jobTitle, email, departmentId, id);
  if (success) {
    showMessage("Changes saved!", "lime");
    Personnel.populateSearchResults();
    filterResults();
    reselectPerson();
    checkEditTabDifferences();
    // These two prevent the delete button in EDIT LOCATION / DEPARTMENT tabs from staying lit up if a previously unused dep is used.
    checkEditDepartmentFields();
  } else {
    showMessage("Failed to save changes!", "red");
  }
}

// ADD TAB - Add new personnel
async function addPersonnel() {
  const fName = $("#add-first-name").val().trim();
  const lName = $("#add-last-name").val().trim();
  const email = $("#add-email").val().trim();
  const jobTitle = $("#add-job-title").val().trim();
  const departmentname = $("#add-department").val();
  const departmentId = Department.getDepartmentByName(departmentname).id;
  const success = await Personnel.addPersonnel(fName, lName, jobTitle, email, departmentId);
  if (success) {
    showMessage("Added new entry!", "lime");
    resetAddTab();
    const refreshed = await Personnel.getAllPersonnel();
    if (refreshed) {
      Personnel.populateSearchResults();
      filterResults();
      reselectPerson();
    } else {
      showMessage("Added entry, but failed to refresh database", "yellow");
    }
    // These two turn off the delete button in edit dep / loc tabs.
    checkEditDepartmentFields();
  } else {
    showMessage("Failed to add entry", "red");
  }
}

// DELETE TAB - Delete selected personnel
async function deletePersonnel() {
  const success = await Personnel.deletePersonnel(Personnel.currentlySelectedId);
  if (success) {
    Personnel.populateSearchResults();
    filterResults();
    disableTabs();
    checkEditDepartmentFields();
    showMessage("Entry deleted!", "lime");
  } else {
    showMessage("Failed to delete entry", "red");
  }
}

// EDIT DEPARTMENTS - Department Select Update
function updateEditDepartmentFields() {
  const departmentName = $("#department-select").val();
  if (departmentName === "NEW DEPARTMENT") {
    Department.currentlySelectedId = null;
    $("#department-name").val("");
    $("#location-change").val("");
  } else {
    let locationId, locationName;
    try {
      locationId = Department.getDepartmentByName(departmentName).locationID;
      locationName = Location.getLocationById(locationId).name;
    } catch(e) {
      showMessage("Warning, this department is corrupted!", "red");
    }
    $("#location-change").val(locationName);
    $("#department-name").val(departmentName);
    Department.currentlySelectedId = Department.getDepartmentByName(departmentName).id;
    Department.selectedDepCurrentName = departmentName;
    Department.selectedDepCurrentLoc = locationName;
  }
}

// EDIT DEPARTMENTS - Save or Add Department
async function saveDepartment() {
  const selectedDepartment = $("#department-select").val();
  const newDepName = $("#department-name").val().trim();
  const locationName = $("#location-change").val();
  const locationId = Location.getLocationByName(locationName).id;
  // Add new department
  if (selectedDepartment === "NEW DEPARTMENT") {
    const success = await Department.addDepartment(newDepName, locationId);
    if (success) {
      showMessage("Added new department!", "lime");
      resetEditDepartments();
      const refreshed = await Department.getAllDepartments();
      if (refreshed) {
        populateDepartmentSelects();
        checkEditLocationFields();
      } else {
        showMessage("Added department, but failed to refresh database", "yellow");
      }   
    } else {
      showMessage("Failed to add department");
    }
  // Save changes to current department
  } else {
    const success = await Department.updateDepartment(newDepName, locationId, Department.currentlySelectedId);
    if (success) {
      showMessage("Saved changes!", "lime");
      populateDepartmentSelects();
      reselectDepartment();
      checkEditDepartmentFields();
      // Prevents delete button in EDIT LOCATIONS staying active when it shouldn't be.
      checkEditLocationFields();
      Personnel.populateSearchResults();
      reselectPerson();
      filterResults();
    } else {
      showMessage("Failed to save changes", "red");
    }
  }
}

// EDIT DEPARTMENTS - Delete existing department
async function deleteDepartment() {
  const selectedDepartment = $("#department-select").val();
  if (selectedDepartment !== "NEW DEPARTMENT") {
    const success = await Department.deleteDepartment(Department.currentlySelectedId);
    if (success) {
      populateDepartmentSelects();
      resetEditDepartments();
      checkEditLocationFields();
      showMessage("Department deleted!", "lime");
    } else {
      showMessage("Failed to delete department", "red");
    }
  }
}

// EDIT LOCATIONS - Location Select Update
function updateEditLocationFields() {
  const locationName = $("#location-select").val();
  if (locationName === "NEW LOCATION") {
    Location.currentlySelectedId = null;
    $("#location-name").val("");
  } else {
    $("#location-name").val(locationName);
    Location.currentlySelectedId = Location.getLocationByName(locationName).id;
  }
}

// EDIT LOCATIONS - Tests to make sure new location names are valid.
function checkLocationNames(newLocationName) {
  newLocationName = newLocationName.toLowerCase();
  if (newLocationName === "new location" || newLocationName === "") return true;
  return Location.locations.find(loc => loc.name.toLowerCase() === newLocationName);
}

// Returns true on existing / invalid department name.
function checkDepartmentNames(newDepartmentName) {
  newDepartmentName = newDepartmentName.toLowerCase();
  if (newDepartmentName === "new department" || newDepartmentName === "") return true;
  return Department.departments.find(dep => dep.name.toLowerCase() === newDepartmentName);
}

// EDIT LOCATIONS - Save or Add Location
async function saveLocation() {
  const locationNameSelect = $("#location-select").val();
  const newLocationName =  $("#location-name").val().trim();
  // Add new location
  if (locationNameSelect === "NEW LOCATION") {
    const success = await Location.addLocation(newLocationName);
    if (success) {
      showMessage("Added location!", "lime");
      resetEditLocations();
      const refreshed = await Location.getAllLocations();
      if (refreshed) {
          populateLocationSelects();
          checkEditLocationFields();
          Personnel.populateSearchResults();
          reselectPerson();
          filterResults();
        } else {
          checkEditLocationFields();
          showMessage("Added location, but failed to refresh database", "yellow");
        }
    } else {
      showMessage("Failed to add location", "red");
    }
    // Save changes to location
  } else {
    const success = await Location.updateLocation(newLocationName, Location.currentlySelectedId);
    if (success) {
      showMessage("Saved changes!", "lime");
      populateLocationSelects();
      reselectLocation();
      checkEditLocationFields();
      updateEditDepartmentFields();
      Personnel.populateSearchResults();
      reselectPerson();
      filterResults();
    } else {
      showMessage("Failed to save changes!", "red");
    }
  }
}

// EDIT LOCATIONS - Delete Location
async function deleteLocation() {
  const success = await Location.deleteLocation(Location.currentlySelectedId);
  if (success) {
    populateLocationSelects();
    resetEditLocations();
    showMessage("Location deleted!", "lime");
  } else {
    showMessage("Failed to delete location!", "red");
  }
}

// Reselects last Department - Used after saving changes to an existing department.
function reselectDepartment() {
  const departmentName = Department.getDepartmentById(Department.currentlySelectedId).name;
  $("#department-select").val(departmentName);
  updateEditDepartmentFields();
}

// Reselects last location
function reselectLocation() {
  const locationName = Location.getLocationById(Location.currentlySelectedId).name;
  $("#location-select").val(locationName);
  updateEditLocationFields();
}

// Checks edit department fields
function checkEditDepartmentFields() {
  setTimeout(() => {
    const selectedDepartment = $("#department-select").val();
    const newDepName = $("#department-name").val().trim();
    const newDepLocation = $("#location-change").val();
    // Add New Department
    if (selectedDepartment === "NEW DEPARTMENT") {
      if (checkDepartmentNames(newDepName) || newDepLocation === null) {
        $("#save-department").addClass("disabled");
        $("#delete-department").addClass("disabled");
      } else {
        $("#save-department").removeClass("disabled");
      }
    // Edit Department
    } else {
      const departmentId = Department.getDepartmentByName(selectedDepartment).id;
      const inUseCount = checkIfDepartmentInUse(departmentId);
      if (inUseCount <= 0) {
        $("#delete-department").removeClass("disabled");
      } else {
        $("#delete-department").addClass("disabled");
      }
      if (newDepLocation === null) {
        $("#save-department").addClass("disabled");
        // If current loc and new loc are different AND names are the same, OR if the new name is valid THEN remove disabled class.
      } else if ((Department.selectedDepCurrentLoc !== newDepLocation &&
        newDepName.toLowerCase() === selectedDepartment.toLowerCase())
        || !checkDepartmentNames(newDepName)) {
        
        $("#save-department").removeClass("disabled");
      } else {
        $("#save-department").addClass("disabled");
      }
    }
  }, 0);
}

// Checks Edit Location fields
function checkEditLocationFields() {
  setTimeout(() => {
    const selectedLocation = $("#location-select").val();
    const locationName = $("#location-name").val().trim();
    // Add New Location
    if (selectedLocation === "NEW LOCATION") {
      if (checkLocationNames(locationName)) {
        $("#save-location").addClass("disabled");
        $("#delete-location").addClass("disabled");
      } else {
        $("#save-location").removeClass("disabled");
      }
    } else {
      // Edit Location
      const inUseCount = checkIfLocationInUse(Location.currentlySelectedId);
      if (inUseCount <= 0) {
        $("#delete-location").removeClass("disabled");
      } else {
        $("#delete-location").addClass("disabled");
      }
      if (checkLocationNames(locationName)) {
        $("#save-location").addClass("disabled");
      } else {
        $("#save-location").removeClass("disabled");
      }
    }
  }, 0);
}

// Toggles betweem card and row view.
function toggleResultsView() {
  $(".circle-button").toggleClass("active-circle");
  $(".card-container").toggleClass("selected-results-container");
  $(".table-container").toggleClass("selected-results-container");
  $(".table-header").toggleClass("selected-results-container");
  // Switches between scrollbar being placed next to cards and on top of rows.
  $(".search-results-container").toggleClass("auto-overflow overlay-overflow");
}

// Displays a message to the user for a few seconds
function showMessage(msg, colour = "snow") {
  clearTimeout(globalTimeout);
  $(".message-output").html(msg).css("color", colour);
  globalTimeout = setTimeout(() => {
    $(".message-output").html("Company Directory").css("color", "snow");
  }, 3000);
}

/* EVENT LISTENERS */
/*~~~~~~~~~~~~~~~~*/

// Main Tab Change listener
$(".tab").on("click", e => {
  changeMainTab(e);
});

// Bottom Tab change listener
$(".bottom-tab").on("click", e => {
  changeBottomTab(e);
});

// Row View Toggle
$(".circle-button").on("click", () => {
  toggleResultsView();
});

// --- SEARCH TAB --- //
// Filter listneners
$("#name-filter").on("keydown", () => {
  filterResults();
});
// Filter listneners
$("#department-filter").on("change", () => {
  filterResults();
});
// Filter listneners
$("#location-filter").on("change", () => {
  filterResults();
});
// Reset Filter button
$("#reset-filter-btn").on("click", () => {
  resetFilter();
});

// --- EDIT TAB --- //
// Save Changes Button
$("#save-changes").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  saveEditChanges();
});
// Edit tab input checks
$(".edit-tab-text-input").on("keydown", () => {
  checkEditTabDifferences();
});
// Edit tab input checks
$(".edit-tab-select-input").on("change", () => {
  checkEditTabDifferences();
});

// --- ADD TAB -- //
// Create Entry Button
$("#add-entry").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  addPersonnel();
});
// Add tab input checks
$(".add-tab-text-input").on("keydown", () => {
  checkAddTabRequiredFields();
});
// Add tab input checks
$(".add-tab-select-input").on("change", () => {
  checkAddTabRequiredFields();
});

// --- DELETE TAB -- //
// Delete Button
$("#delete-entry").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  deletePersonnel();
});

// --- EDIT DEPARTMENTS --- //
// Department Select
$("#department-select").on("change", () => {
  updateEditDepartmentFields();
  checkEditDepartmentFields();
});
// Edit Department input listeners
$("#department-name").on("keydown", () => {
  checkEditDepartmentFields();
});
// Edit Department input listeners
$("#location-change").on("change", () => {
  checkEditDepartmentFields();
});
// Save / Add new department button
$("#save-department").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  saveDepartment();
});
// Delete department button
$("#delete-department").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  deleteDepartment();
});

// --- EDIT LOCATIONS --//
// Location Select
$("#location-select").on("change", () => {
  updateEditLocationFields();
  checkEditLocationFields();
});

$("#location-name").on("keydown", () => {
  checkEditLocationFields();
});

// Save Location button
$("#save-location").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  saveLocation();
});
// Delete Location Button
$("#delete-location").on("click", e => {
  if ($(e.currentTarget).hasClass("disabled")) return;
  deleteLocation();
});

//~~~~~~ INIT SETUP ~~~~~~~//
function initSetup() {
  Promise.all([Department.getAllDepartments(), Location.getAllLocations(), Personnel.getAllPersonnel()]).then(val => {
    if (val[0] && val[1] && val[2]) {
      Personnel.populateSearchResults();
      populateLocationSelects();
      populateDepartmentSelects();
      updateShowingCounter();
      resetAddTab();
      resetEditDepartments();
      resetEditLocations();
      disableTabs();
      resetFilter();
      filterResults();
    } else {
      showMessage("Error connecting to database!", "red");
    }
  })
}

initSetup();