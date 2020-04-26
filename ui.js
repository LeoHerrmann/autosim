window.addEventListener("load", function() {
    var submenu_toggle_buttons = document.querySelectorAll(".submenu_header > button");

    for (let button of submenu_toggle_buttons) {
        button.addEventListener("click", function(e) {
            e.target.parentElement.parentElement.getElementsByClassName("submenu_content")[0].classList.toggle("closed");

            if (e.target.innerText == "+") {
                e.target.innerText = "-";
            }

            else {
                e.target.innerText = "+";
            }
        });
    }



    var car_select = document.getElementById("car_select");

    for (let car_index in car_data) {
        let car_name = car_data[car_index].properties.name;
        car_select.innerHTML += `<option value='${car_index}'>${car_name}</option>`;
    }

    car_select.selectedIndex = first_car_index;

    car_select.addEventListener("change", function(event) {
        var car_index = event.target.value;

        car.properties = car_data[car_index].properties;
        car.data.rpm = car.properties.idle_rpm;
        car.data.gear = 1;
        car.data.shift_progress = 1;
        car.data.speed = calculator.speed_from_rpm(car, car.data.rpm);

        context.close();
        context = new AudioContext();
        car.sound.setup_sound();

        gauges.clear();
        gauges.initialize();
    });
});
