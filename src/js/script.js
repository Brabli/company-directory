/* PERSONNEL CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Personnel {

  static personnel = [];
  static currentlySelectedId;

  // Return array of all personnel rows
  static async getAllPersonnel() {
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
  }

  // Add personnal row
  static async addPersonnel(firstName, lastName, jobTitle, email, departmentId) {
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
  }

  // Update existing personnnel row by ID
  static async updatePersonnel(firstName, lastName, jobTitle, email, departmentId, id) {
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
      console.log("Successful update!");
      return true;
    } else {
      console.log("Update failed!");
      return false;
    }
  }

  // Delete personnel row by ID
  static async deletePersonnel(id) {
    const res = await fetch("php/deletePersonnel.php", {
      method: "POST",
      body: JSON.stringify({
        id
      })
    });
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully deleted!");
      return true;
    } else {
      console.log("Delete failed!");
      return false;
    }
  }

  static getPersonById(id) {
    return Personnel.personnel.find(person => person.id === id);
  }

  static async populateSearchResults(refresh = true) {
    if (refresh) await Personnel.getAllPersonnel();

    $(".card-container").html("");
    $(".table-container").html("");
    let counter = 0;
    let altClass;
    Personnel.personnel.forEach(person => {
      counter % 2 === 0 ? altClass = "alt-grey" : altClass = "";
      const department = Department.getDepartmentById(person.departmentID);
      const location = Location.getLocationById(department.locationID)
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
          <p class="card-data card-department">${department.name}</p>
          <p class="card-data card-location">${location.name}</p>
        </div>
      </div>`);
      // ROWS
      $(".table-container").append(`
      <div class="person-row ${altClass}" data-id="${person.id}">
        <div class="cell cell-name b-right">${person.firstName} ${person.lastName}</div>
        <div class="cell cell-job-title b-right">${person.jobTitle}Supervisor Manager</div>
        <div class="cell cell-department b-right">${department.name}</div>
        <div class="cell cell-location">${location.name}</div>
      </div>`);
      counter++;
    });

    // Card Select Event listener
    $(".person-card").on("click", e => {
      Personnel.currentlySelectedId = $(e.currentTarget).data("id").toString();
      selectCard(Personnel.currentlySelectedId);
    });

    filterResults();
  }
}



/* DEPARTMENT CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Department {

  static departments = [];
  static currentlySelectedDepId;
  static currentltSelectedDepName;

  static async getAllDepartments() {
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
  }

  static async addDepartment(name, locationId) {
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
  }

  static async updateDepartment(name, locationId, id) {
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
      console.log("Successfully updated department!");
    } else {
      console.log("Failed to update department!");
    }
  }

  static async deleteDepartment(id) {
    const res = await fetch("php/deleteDepartment.php", {
      method: "POST",
      body: JSON.stringify({
        id
      })
    });
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully deleted!");
      return true;
    } else {
      console.log("Delete failed!");
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
  static currentlySelectedLocId;
  static currentltSelectedLocName;

  static async getAllLocations() {
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
  }

  static async addLocation(name) {
    const res = await fetch("php/addLocation.php", {
      method: "POST",
      body: JSON.stringify({
        name
      })
    });
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully added location!");
    } else {
      console.log("Failed to add location!");
    }
  }

  // Update existing location in database
  static async updateLocation(name, id) {
    const res = await fetch("php/updateLocation.php", {
      method: "POST",
      body: JSON.stringify({
        name,
        id
      })
    });
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully updated!");
    } else {
      console.log("Update failed!");
    }
  }

  // Delete location by ID
  static async deleteLocation(id) {
    const res = await fetch("php/deleteLocation.php", {
      method: "POST",
      body: JSON.stringify({
        id
      })
    });
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully deleted!");
    } else {
      console.log("Delete failed!");
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
  // TODO Change to a REGULAR FUNCTION NOT AN ARROW FUNCTION!!!
  // setTimeout() is sadly required to prevent a bug with name search box.
  // jQuery .each() breaks a bit when inside a timeout, so I couldn't use it here.
  // IE, $(this) refers to the window object instead of the current jQuery object.
  setTimeout(() => {
    // Get filter values
    const filterNameString = $("#name-filter").val().toLowerCase().trim();
    const filterDepString = $("#department-filter").val();
    const filterLocString = $("#location-filter").val();
    // Loop over all results.
    $(".person-card").each( (i, card) => {
      // Get card values.
      const cardDepartment = card.getElementsByClassName("card-department")[0].innerHTML;
      const cardLocation = card.getElementsByClassName("card-location")[0].innerHTML;
      const cardName = card.getElementsByClassName("card-name")[0].innerHTML;
      // Test each value against the appropriate filter.
      const depFilter = testDepartment(cardDepartment, filterDepString);
      if (depFilter) { card.style.display = "none"; return; };
      const locFilter = testLocation(cardLocation, filterLocString);
      if (locFilter) { card.style.display = "none"; return; };
      const nameFilter = testName(cardName, filterNameString);
      if (nameFilter) { card.style.display = "none"; return; };
      // If card does not get flagged by the filter, set display to flex.
      card.style.display = "flex";
    });
    // Refresh counter after filtering,
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
  $(".person-card").each( (i, obj) => {
    // On load, obj.style.display is "" for some reason. The || is used for this reason.
    if (obj.style.display === "flex" || obj.style.display === "") totalVisible++;
    total++;
  });
  $(".showing-count").html(totalVisible);
  $(".total-count").html(total);
}

// Refreshes location select elements.
// TODO Refresh beforehand?
function populateLocationSelects() {
  const standardLocOptions = Location.getHtmlOptions();
  const allLocsOption = '<option class="location-option" data-location-id="all">All Locations</option>';
  const newLocOption = '<option>NEW LOCATION</option>';
  $("#location-filter").html(allLocsOption + standardLocOptions);
  $("#location-change").html(standardLocOptions);
  $("#location-select").html(newLocOption + standardLocOptions)
}

// Refreshes department select elements.
// TODO Refresh beforehand?
function populateDepartmentSelects() {
  const standardDepOptions = Department.getHtmlOptions();
  const allDepsOption = '<option data-department-id="all">All Departments</option>';
  const newDepOption = '<option>NEW DEPARTMENT</option>';
  $("#department-filter").html(allDepsOption + standardDepOptions);
  $("#add-department").html(standardDepOptions);
  $("#edit-department").html(standardDepOptions);
  $("#department-select").html(newDepOption + standardDepOptions);
}

// Switches between "main" tabs at top of app.
function changeMainTab(e) {
  const $tab = $(e.currentTarget);
  const $tabMenu = $(`.${$tab.html()}-menu`);
  $tab.addClass("selected-tab");
  $tabMenu.addClass("selected-menu");
  $tab.siblings().removeClass("selected-tab");
  $tabMenu.siblings().removeClass("selected-menu");
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

// Reselects the previously selected card
function reselectCard() {
  selectCard(Personnel.currentlySelectedId);
}

// Returns card by personnel id.
function getCardById(personnelId) {
  return $(`.person-card[data-id="${personnelId}"`);
}

// Selects card
function selectCard(personnelId) {
  const $card = getCardById(personnelId);
  const person = Personnel.getPersonById(Personnel.currentlySelectedId);
  const personDepartment = Department.getDepartmentById(person.departmentID).name;

  $card.addClass("selected-card");
  $card.siblings().removeClass("selected-card");

  $("#edit-first-name").val(person.firstName);
  $("#edit-last-name").val(person.lastName);
  $("#edit-email").val(person.email);
  $("#edit-job-title").val(person.jobTitle);
  $("#edit-department").val(personDepartment);
}

// EDIT TAB - Save Changes
// TODO Add check so only if a field is edited does the button become active.
async function saveEditChanges() {
  const id = Personnel.currentlySelectedId;
  const fName = $("#edit-first-name").val();
  const lName = $("#edit-last-name").val();
  const email = $("#edit-email").val();
  const jobTitle = $("#edit-job-title").val();
  const departmentName = ($("#edit-department").val());
  const departmentId = Department.getDepartmentByName(departmentName).id;
  // TODO Add checks here!
  await Personnel.updatePersonnel(fName, lName, jobTitle, email, departmentId, id);
  await Personnel.populateSearchResults(true);

  reselectCard();
}

// ADD TAB - Add new personnel
async function addPersonnel() {
  const fName = $("#add-first-name").val();
  const lName = $("#add-last-name").val();
  const email = $("#add-email").val();
  const jobTitle = $("#add-job-title").val();
  const departmentname = ($("#add-department").val());
  const departmentId = Department.getDepartmentByName(departmentname).id;
  // TODO Add checks here!
  await Personnel.addPersonnel(fName, lName, jobTitle, email, departmentId);
  await Personnel.populateSearchResults(true);

  reselectCard();
}

// DELETE TAB - Delete selected personnel
// TODO Check to see if something is even selected before activating button
async function deletePersonnel() {
  await Personnel.deletePersonnel(Personnel.currentlySelectedId);
  // TODO Have a better way of doing this
  await Personnel.populateSearchResults();
}

// EDIT DEPARTMENTS - Department Select Update
function updateEditDepartmentFields() {
  const departmentName = $("#department-select").val();
  if (departmentName === "NEW DEPARTMENT") {
    // TODO deactivate button until both values are not blank.
    $("#department-name").val("");
    $("#location-change").val("");
  } else {
    const locationId = Department.getDepartmentByName(departmentName).locationID;
    const locationName = Location.getLocationById(locationId).name;
    $("#location-change").val(locationName);
    $("#department-name").val(departmentName);
  }
}

// EDIT DEPARTMENTS - Save or Add Department
async function saveDepartment() {
  const selectedDepartment = $("#department-select").val();
  const newDepartmentName = $("#department-name").val();
  const locationName = $("#location-change").val();
  const locationId = Location.getLocationByName(locationName).id;
  // Add new department
  if (selectedDepartment === "NEW DEPARTMENT") {
    const success = await Department.addDepartment(newDepartmentName, locationId);
    if (success) {
      console.log("Successfully added new Department!");
    } else {
      console.log("Failed to add new Department!");
    }
    await Department.getAllDepartments();
    populateDepartmentSelects();
  // Save changes to current department
  } else {
    const departmentId = Department.getDepartmentByName(selectedDepartment).id;
    const success = await Department.updateDepartment(newDepartmentName, locationId, departmentId);
    if (success) {
      console.log("Saved department!");
    } else {
      console.log("Failed to save department!");
    }
    await Department.getAllDepartments();
    populateDepartmentSelects();
    await Personnel.populateSearchResults();
  }
}

// EDIT DEPARTMENTS - Delete existing department
async function deleteDepartment() {
  const selectedDepartment = $("#department-select").val();
  if (selectedDepartment !== "NEW DEPARTMENT") {
    const departmentId = Department.getDepartmentByName(selectedDepartment).id;
    const inUseCount = checkIfDepartmentInUse(departmentId);
    if (inUseCount <= 0) { 
      const success = await Department.deleteDepartment(departmentId);
      if (success) {
        console.log("Successfully deleted department!");
        // TODO if success don't update server just remove from dep array
        await Department.getAllDepartments();
        populateDepartmentSelects();
      } else {
        console.log("Failed to delete department!");
      }
    } else {
      console.log(`Cannot delete department as ${inUseCount} personnel are in this department!`);
    }
  }
}

// EDIT LOCATIONS - Location Select Update
function updateEditLocationFields() {
  const locationName = $("#location-select").val();
  if (locationName === "NEW LOCATION") {
    $("#location-name").val("");
  } else {
    $("#location-name").val(locationName);
  }
}

// TODO do his for departments also
function checkLocationNames(newLocationName) {
  return Location.locations.find(loc => loc.name.toLowerCase() === newLocationName.toLowerCase());
}

// EDIT LOCATIONS - Save or Add Location
async function saveLocation() {
  const locationNameSelect = $("#location-select").val();
  const newLocationName =  $("#location-name").val();

  if (checkLocationNames(newLocationName)) {
    console.log("A location with that name already exists!");
    return;
  }

  if (locationNameSelect === "NEW LOCATION") {
    await Location.addLocation(newLocationName);
    await Location.getAllLocations();
    Personnel.populateSearchResults(false);
    populateLocationSelects();
  } else {
    const locationId = Location.getLocationByName(locationNameSelect).id;
    await Location.updateLocation(newLocationName, locationId);
    await Location.getAllLocations();
    Personnel.populateSearchResults(false);
    populateLocationSelects();
  }
}

// EDIT LOCATIONS - Delete Location
async function deleteLocation() {
  const locationNameSelect = $("#location-select").val();
  let locationId;
  try {
    locationId = Location.getLocationByName(locationNameSelect).id;
    const inUseCount = checkIfLocationInUse(locationId);
    if (inUseCount <= 0) { 
      const success = await Location.deleteLocation(locationId);
      if (success) {
        console.log("Successfully deleted location!");
        // TODO if success don't update server just remove from dep array
        await Location.getAllLocations();
        populateLocationSelects();
      } else {
        console.log("Failed to delete location!");
      }
    } else {
      console.log(`Cannot delete ${locationNameSelect} as it is used by ${inUseCount} departments!`);
    }
  } catch(e) {
    return;
  }
}

// TODO make sure a new department with name that's the same as an existing department can't be created
// TODO don't use arrow functions when using $(this).
// TODO add function -> Reset Edit Department tab.

/* EVENT LISTENERS */
/*~~~~~~~~~~~~~~~~*/

// Main Tab Change listener
$(".tab").on("click", e => {
  changeMainTab(e);
});

// SEARCH TAB - Filter listneners
$("#name-filter").on("keydown", () => {
  filterResults();
});

$("#department-filter").on("change", () => {
  filterResults();
});

$("#location-filter").on("change", () => {
  filterResults();
});

// SEARCH TAB -  Reset Filter options
$("#reset-filter-btn").on("click", () => {
  resetFilter();
});

// EDIT TAB - Save Changes Button
$("#save-changes").on("click", () => {
  saveEditChanges();
})

// ADD TAB - Add Entry Button
$("#add-entry").on("click", () => {
  addPersonnel();
})

// DELETE TAB - Delete Button
$("#delete-entry").on("click", () => {
  deletePersonnel();
});

// Bottom Tab change listener
$(".bottom-tab").on("click", e => {
  changeBottomTab(e);
});

// EDIT DEPARTMENTS - Department Select
$("#department-select").on("change", () => {
  // TODO Add department field reset
  updateEditDepartmentFields();
});

// EDIT DEPARTMENTS - Save / Add new department button
$("#save-department").on("click", () => {
  saveDepartment();
});

// EDIT DEPARTMENTS - Delete department button
$("#delete-department").on("click", () => {
  deleteDepartment();
});

// EDIT LOCATIONS - Location Select
$("#location-select").on("change", () => {
  updateEditLocationFields();
});

// EDIT LOCATIONS - Save Location button
$("#save-location").on("click", () => {
  saveLocation();
});

// EDIT LOCATIONS - Delete Location Button
$("#delete-location").on("click", () => {
  deleteLocation();
});

$(".circle-button").on("click", () => {
  $(".circle-button").toggleClass("active-circle");
  $(".card-container").toggleClass("selected-results-container");
  $(".table-container").toggleClass("selected-results-container");
});

//~~~~~~ INIT SETUP ~~~~~~~//
async function initSetup() { 
  await Department.getAllDepartments();
  await Location.getAllLocations();
  await Personnel.getAllPersonnel();
  Personnel.populateSearchResults(false);
  populateLocationSelects();
  populateDepartmentSelects();
  updateShowingCounter();
}
initSetup();