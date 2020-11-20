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
      console.log("Successfully retrieved personnel!");
      //console.log(resJson.data);
      Personnel.personnel = resJson.data;
      return resJson.data;
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
  // TODO refactor this
  static getPersonById(id) {
    const person = Personnel.personnel.find(person => {
      return person.id === id;
    });
    return person;
  }

  // TODO move event listener card click here
  static async populateSearchResults(refresh = true) {
    if (refresh) await Personnel.getAllPersonnel();

    $(".search-results-container").html("");
    Personnel.personnel.forEach(person => {
      const department = Department.getDepartmentById(person.departmentID);
      const location = Location.getLocationById(department.locationID)
      
      $(".search-results-container").append(`
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
    });

    // Card Select Event listener
    $(".person-card").on("click", e => {
      const $card = $(e.currentTarget)
      $card.addClass("selected-card");
      $card.siblings().removeClass("selected-card");

      Personnel.currentlySelectedId = $card.data("id").toString();
      // TODO Add check here
      const person = Personnel.getPersonById(Personnel.currentlySelectedId);
      // TODO Add active and non-active class to button
      $("#save-changes").data("id", Personnel.currentlySelectedId)

      $("#edit-first-name").val(person.firstName);
      $("#edit-last-name").val(person.lastName);
      $("#edit-email").val(person.email);
      $("#edit-job-title").val(person.jobTitle);
      const personDepartment = Department.getDepartmentById(person.departmentID).name;
      $("#edit-department").val(personDepartment);
    });

    filterResults();
  }
}



/* DEPARTMENT CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Department {

  static departments = [];

  // Update Department.department array
  static async getAllDepartments() {
    const res = await fetch("php/getAllDepartments.php");
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully retrieved departments!");
      Department.departments = resJson.data;
    } else {
      console.log("Failed to retrieve departments!");
      return false;
    }
  }

  // Add department row to database
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
    } else {
      console.log("Failed to add department!");
    }
  }

  // Update existing department row by ID
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

  // Update existing department row by ID
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
    const department = Department.departments.find(dep => dep.id === id);
    return department;
  }

  static getDepartmentByName(name) {
    const department = Department.departments.find(dep => dep.name === name);
    return department;
  }

  static getHtmlOptions(bool) {
    let locationOptionsString = '';
    if (bool) locationOptionsString += '<option class="department-option" data-department-id="all">All Departments</option>';

    Department.departments.forEach(dep => {
      locationOptionsString += `<option class="department-option" data-department-id="${dep.id}" value="${dep.name}">${dep.name}</option>`;
    });

    return locationOptionsString;
  }

}



/* LOCATION CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Location {

  static locations = [];

  static async getAllLocations() {
    const res = await fetch("php/getAllLocations.php");
    const resJson = await res.json();
    if (resJson["status"]["name"] === "ok") {
      console.log("Successfully got locations!");
      Location.locations = resJson.data;
    } else {
      console.log("Failed!");
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
    const location = Location.locations.find(loc => loc.id === id);
    return location;
  }

  static getHtmlOptions() {
    let locationOptionsString =
    '<option class="location-option" data-location-id="all">All Locations</option>';
    Location.locations.forEach(loc => {
      locationOptionsString += `<option class="location-option" data-location-id="${loc.id}" value="${loc.name}">${loc.name}</option>`;
    });
    //console.log(locationOptionsString);
    return locationOptionsString;
  }
}


/* FUNCTIONS */
/*~~~~~~~~~~~*/
// These three return true if card is to be filtered, aka hidden.
function filterDepartment(cardDepartment, filterDepartmentString) {
  if (filterDepartmentString === "All Departments") return false;
  if (filterDepartmentString === cardDepartment) return false;
  return true;
}

function filterLocation(cardLocation, filterLocationString) {
  if (filterLocationString === "All Locations") return false;
  if (filterLocationString === cardLocation) return false;
  return true;
}

function filterName(cardName, filterNameString) {
  if (cardName.toLowerCase().includes(filterNameString)) return false;
  return true;
}

// Filters results
function filterResults() {
  // Timeout is sadly required to prevent a bug with name search box.
  setTimeout(() => {

    const filterNameString = $("#name-filter").val().toLowerCase().trim();
    const filterDepString = $("#department-filter").val();
    const filterLocString = $("#location-filter").val();

    $(".person-card").each( (i, card) => {
      // jQuery .each() breaks a bit when inside a timeout, so I couldn't use it here.
      // IE, $(this) refers to the window object instead of the current jQuery object.
      const cardDepartment = card.getElementsByClassName("card-department")[0].innerHTML;
      const cardLocation = card.getElementsByClassName("card-location")[0].innerHTML;
      const cardName = card.getElementsByClassName("card-name")[0].innerHTML;

      const depFilter = filterDepartment(cardDepartment, filterDepString);
      if (depFilter) { card.style.display = "none"; return; };
  
      const locFilter = filterLocation(cardLocation, filterLocString);
      if (locFilter) { card.style.display = "none"; return; };

      const nameFilter = filterName(cardName, filterNameString);
      if (nameFilter) { card.style.display = "none"; return; };
      // If card does not get flagged by the filter, set display to flex.
      card.style.display = "flex";
    })

    updateShowingCounter();
  }, 0)
}

function populateLocationFilter() {
  // TODO add bool to static method
  $("#location-filter").html(Location.getHtmlOptions());
}

function populateDepartmentSelects() {
  $("#department-filter").html(Department.getHtmlOptions(true));
  const optionsWithoutAllDepartments = Department.getHtmlOptions(false);
  $("#add-department").html(optionsWithoutAllDepartments);
  $("#edit-department").html(optionsWithoutAllDepartments);
}



// Updates the counter in Seach Results title bar
function updateShowingCounter() {
  let total = 0;
  let totalVisible = 0;
  $(".person-card").each( (i, obj) => {
    // On load, obj.style.display is "" for some reason. The || is used for this reason.
    if (obj.style.display === "flex" || obj.style.display === "") {
      totalVisible++;
    }
    total++;
  });
  $(".showing-count").html(totalVisible);
  $(".total-count").html(total);
}


/* EVENT LISTENERS */
/*~~~~~~~~~~~~~~~~*/

$("#name-filter").on("keydown", e => {
  filterResults();
});

$("#location-filter").on("change", e => {
  filterResults();
})

$("#department-filter").on("change", e => {
  filterResults();
})

// Tab Change listener
$(".tab").on("click", e => {

  const $tab = $(e.currentTarget);
  $tab.addClass("selected-tab");
  $tab.siblings().removeClass("selected-tab");

  console.log(`.${$tab.html()}-menu`);
  const $tabMenu = $(`.${$tab.html()}-menu`);
  $tabMenu.addClass("selected-menu");
  $tabMenu.siblings().removeClass("selected-menu");

});

// EDIT TAB Save Changes Button
$("#save-changes").on("click", async e => {
  const fName = $("#edit-first-name").val();
  const lName = $("#edit-last-name").val();
  const email = $("#edit-email").val();
  const jobTitle = $("#edit-job-title").val();

  const departmentname = ($("#edit-department").val());
  const departmentId= Department.getDepartmentByName(departmentname).id;

  const id = $("#save-changes").data("id");

  await Personnel.updatePersonnel(fName, lName, jobTitle, email, departmentId, id);
  // if success...
  await Personnel.populateSearchResults();

  // Reselect card
  $(`.person-card[data-id="${id}"]`).addClass("selected-card");
})

// ADD TAB Add Entry Button
$("#add-entry").on("click", async e => {
  const fName = $("#add-first-name").val();
  const lName = $("#add-last-name").val();
  const email = $("#add-email").val();
  const jobTitle = $("#add-job-title").val();

  const departmentname = ($("#add-department").val());
  const departmentId= Department.getDepartmentByName(departmentname).id;

  await Personnel.addPersonnel(fName, lName, jobTitle, email, departmentId);

  // if success..
  await Personnel.populateSearchResults();

  // Reselects card
  const id = $("#save-changes").data("id");
  // TODO fix bug which add class incorrectly to create entry button / add button
  $(`.person-card[data-id="${id}"]`).addClass("selected-card");
})

// TODO Check to see if something is even selected before activating button
// DELETE TAB Delete Button
$("#delete-entry").on("click", async e => {
  // TODO write a function to select currently selcted person id
  const id = $("#save-changes").data("id");
  await Personnel.deletePersonnel(id);
  await Personnel.populateSearchResults();
});

// Reset Filter options
$("#reset-filter").on("click", e => {
  console.log("HELLO");
  $("#name-filter").val("");
  $("#department-filter").val("All Departments");
  $("#location-filter").val("All Locations");
  filterResults();
});

// INIT SETUP //
async function initSetup() {
  await Department.getAllDepartments();
  await Location.getAllLocations();
  await Personnel.getAllPersonnel();
  Personnel.populateSearchResults(false);
  populateLocationFilter();
  populateDepartmentSelects();
  updateShowingCounter();
}

initSetup();