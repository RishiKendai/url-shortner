// ! SELECTORS
const generate_btn = document.querySelector("#generate_btn");
const all_url_btn = document.querySelector("#all_url_btn");
const short_url_field = document.querySelector("#short_url");
const error_close = document.querySelector("#error_close");
const error_msg = document.querySelector("#error_msg");
const child_rows = document.querySelector("#child-rows");

// ! Global Declarations
let timer;

// ! EVENT LISTENERS
generate_btn.addEventListener("click", createShortUrl);
all_url_btn.addEventListener("click", getURL);
error_close.addEventListener("click", closeError);

// ! FUNCTIONS
function createShortUrl() {
  const full_url = document.querySelector('[name="full_url"]').value;
  if (full_url === "") {
    closeError();
    document.querySelector("#error").classList.add("show");
    error_msg.textContent = "URL Field is Empty...";
    timer = setTimeout(() => {
      closeError();
    }, 5000);
    return;
  }
  $.ajax({
    method: "post",
    url: "/short-url",
    data: { full_url },
    dataType: "json",
    async: true,
    success: function (res) {
      if (res.status) {
        short_url_field.style.display = "flex";
        const a = document.querySelector("#short_url a");
        a.setAttribute("href", res.short_url);
        a.textContent = res.short_url;
      } else {
        closeError();
        document.querySelector("#error").classList.add("show");
        error_msg.textContent = res.msg;
        timer = setTimeout(() => {
          closeError();
        }, 5000);
      }
    },
  });
}

// Fetch all URLS
function getURL() {
  $.ajax({
    method: "get",
    url: "/all-url",
    dataType: "json",
    async: true,
    success: function (res) {
      if (res.status) return displayUrls(res.urls);

      closeError();
      document.querySelector("#error").classList.add("show");
      error_msg.textContent = res.msg;
      timer = setTimeout(() => {
        closeError();
      }, 5000);
    },
  });
}

// Close the Error section
function closeError() {
  clearTimeout(timer);
  error_msg.textContent = "";
  document.querySelector("#error").classList.remove("show");
}

// Display all URLS
function displayUrls(urls) {
  document.querySelector("#all_url").style.display = "block";
  child_rows.innerHTML = "";
  urls.forEach((url) => {
    // Create heading for URLs
    const child_row = document.createElement("div");
    child_row.classList.add("row", "child-row");
    // Add Long url
    const col1 = document.createElement("p");
    const col1_aTag = document.createElement("a");
    col1_aTag.setAttribute("href", url.long_url);
    col1_aTag.textContent = url.long_url;
    col1.appendChild(col1_aTag);
    col1.classList.add("col-1", "child-col");
    // Add Short url
    const col2 = document.createElement("p");
    const col2_aTag = document.createElement("a");
    col2_aTag.setAttribute("href", url.short_url);
    col2_aTag.textContent = url.short_url;
    col2.appendChild(col2_aTag);
    col2.classList.add("col-2", "child-col");
    // Add url clicks
    const col3 = document.createElement("p");
    col3.textContent = url.clicks;
    col3.classList.add("col-3", "child-col");
    // Append it to child row
    child_row.appendChild(col1);
    child_row.appendChild(col2);
    child_row.appendChild(col3);

    child_rows.appendChild(child_row);
  });
}
