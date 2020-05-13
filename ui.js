window.addEventListener("load", function() {
    add_menu_button_events();
    setup_car_select();



    function add_menu_button_events() {
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
    }



    function setup_car_select() {
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
    }
});



var gauges = {
    initialize: function() {
        var rpm_gauge = document.getElementById("rpm_gauge");

        for (var i = 0; i <= car.properties.rpm_limiter / 1000; i++) {
            var new_indicator_text = i;
            var new_indicator_rotation = i * 1000 / car.properties.rpm_limiter * (360 - 120) - 120;

            var new_indicator = document.createElement("div");
            new_indicator.classList.add("indicator");
            new_indicator.style.transform = "rotate(" + new_indicator_rotation + "deg)";

            var new_indicator_text_container = "<span>" + new_indicator_text + "</span>";
            new_indicator.innerHTML = new_indicator_text_container;

            rpm_gauge.append(new_indicator);
        }


        var speed_gauge = document.getElementById("speed_gauge");

        for (var i = 0; i <= 300; i+= 50) {
            var new_indicator_text = i;
            var new_indicator_rotation = i / 300 * (360 - 120) - 120;

            var new_indicator = document.createElement("div");
            new_indicator.classList.add("indicator");
            new_indicator.style.transform = "rotate(" + new_indicator_rotation + "deg)";

            var new_indicator_text_container = "<span>" + new_indicator_text + "</span>";
            new_indicator.innerHTML = new_indicator_text_container;

            speed_gauge.append(new_indicator);
        }
    },

    update: function() {
        var rpm_gauge = document.getElementById("rpm_gauge");
        rpm_gauge_needle = rpm_gauge.getElementsByClassName("current_needle")[0];
        rpm_gauge_text_container = rpm_gauge.getElementsByTagName("span")[0];

	    rpm_gauge_needle.style.transform = `rotate(${car.data.rpm / car.properties.rpm_limiter * (360 - 120) - 120}deg)`;
    	rpm_gauge_text_container.innerText = Math.round(car.data.rpm);


        var speed_gauge = document.getElementById("speed_gauge");
        speed_gauge_needle = speed_gauge.getElementsByClassName("current_needle")[0];
        speed_gauge_text_container = speed_gauge.getElementsByTagName("span")[0];

    	speed_gauge_needle.style.transform = `rotate(${car.data.speed * 3.6 / 300 * (360 - 120) - 120}deg)`;
    	speed_gauge_text_container.innerText = Math.round(car.data.speed * 3.6);


    	document.getElementById("gear_indicator").innerText = car.data.gear;
    },

    clear: function() {
        var indicators = document.querySelectorAll(".gauge .indicator");

        for (let indicator of indicators) {
            indicator.remove();
        }
    }
};
