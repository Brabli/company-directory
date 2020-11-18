/* PERSONNEL CLASS */
/*~~~~~~~~~~~~~~~~~~*/
class Personnel {

  static personnel = [];

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

  static async populateSearchResults(refresh = true) {
    if (refresh) await Personnel.getAllPersonnel();
    Personnel.personnel.forEach(person => {
      const department = Department.getDepartmentById(person.departmentID);
      const location = Location.getLocationById(department.locationID)
      $(".search-results-container").append(`
      <div class="person-card">
        <p class="card-data card-name">${person.firstName} ${person.lastName}</p>
        <p class="card-data card-email">${person.email}</p>
        <p class="card-data card-job-title">${person.jobTitle}</p>
        <p class="card-data card-department">${department.name}</p>
        <p class="card-data card-location">${location.name}</p>
      </div>`)
    });
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
      console.log(Department.departments);
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

  static getHtmlOptions() {
    let locationOptionsString = '<option class="department-option" data-department-id="all">All Departments</option>';
    Department.departments.forEach(dep => {
      locationOptionsString += `<option class="department-option" data-department-id="${dep.id}" value="${dep.name}">${dep.name}</option>`;
    });
    console.log(locationOptionsString);
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
      console.log("Success!");
      Location.locations = resJson.data;
      console.log(Location.locations);
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
    let locationOptionsString = '<option class="location-option" data-location-id="all">All Locations</option>';
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

    $(".person-card").each( (i, obj) => {
      // jQuery .each() breaks a bit when inside a timeut, so I couldn't use it here.
      // IE, $(this) refers to the window object instead of the current jQuery object.
      const cardDepartment = obj.getElementsByClassName("card-department")[0].innerHTML;
      const cardLocation = obj.getElementsByClassName("card-location")[0].innerHTML;
      const cardName = obj.getElementsByClassName("card-name")[0].innerHTML;

      const depFilter = filterDepartment(cardDepartment, filterDepString);
      if (depFilter) { obj.style.display = "none"; return; };
  
      const locFilter = filterLocation(cardLocation, filterLocString);
      if (locFilter) { obj.style.display = "none"; return; };

      const nameFilter = filterName(cardName, filterNameString);
      if (nameFilter) { obj.style.display = "none"; return; };

      obj.style.display = "flex";
    })
  }, 0)
}


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
  $(e.currentTarget).siblings().removeClass("selected-tab");
  $(e.currentTarget).addClass("selected-tab");
});

function populateLocationFilter() {
  $("#location-filter").html(Location.getHtmlOptions());
}

function populateDepartmentFilter() {
  $("#department-filter").html(Department.getHtmlOptions());
}


// INIT SETUP

async function initSetup() {
  await Department.getAllDepartments();
  await Location.getAllLocations();
  Personnel.populateSearchResults();
  populateLocationFilter();
  populateDepartmentFilter();
}

initSetup();