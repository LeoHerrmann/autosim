function toggle_additional_info_container(clicked_button) {
    additional_info_container = document.getElementById("additional_info_container");

    if (additional_info_container.style.display == "grid") {
        additional_info_container.style.display = "none";
        clicked_button.innerText = "+";
    }

    else {
        additional_info_container.style.display = "grid";
        clicked_button.innerText = "-";
    }
}



window.addEventListener("load", function() {
    var car_select = document.getElementById("car_select");

    for (let car_index in car_data) {
        let car_name = car_data[car_index].properties.name;
        car_select.innerHTML += `<option value='${car_index}'>${car_name}</option>`;
    }

    car_select.selectedIndex = first_car_index;

    car_select.addEventListener("change", function(event) {
        var car_index = event.target.value;
        change_car(car_index);
    });
});
