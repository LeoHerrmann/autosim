function toggle_additional_info_container(clicked_button) {
    additional_info_container = document.getElementById("additional_info_container");

    if (additional_info_container.style.display == "block") {
        additional_info_container.style.display = "none";
        clicked_button.innerText = "+";
    }
    else {
        additional_info_container.style.display = "block";
        clicked_button.innerText = "-";
    }
}
