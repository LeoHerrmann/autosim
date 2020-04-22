const frame_rate = 1000 / 60;
var frame_number = 0;
var first_frame_date = Date.now();
var current_frame_rate = 0;

const sound = true;
var context = new AudioContext();

const first_car_index = 1;

var aerodynamics = true;
var rolling_resistance = true;
var angle = 0;



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



var calculator = {
    speed_from_rpm: function(car, rpm) {
        var smooth_shift_progress = Math.sin(car.data.shift_progress / 2 * Math.PI);

        var wheel_rpm = rpm / (smooth_shift_progress * car.properties.gear_ratios[car.data.gear - 1] + (1 - smooth_shift_progress) * car.properties.gear_ratios[car.data.previous_gear - 1]) / car.properties.final_drive;
        var wheel_rps = wheel_rpm / 60;
        var wheel_speed =  Math.PI * car.properties.tire_diameter * wheel_rps;

        return wheel_speed;
    },

    rpm_from_speed: function(car, speed) {
        var smooth_shift_progress = Math.sin(car.data.shift_progress / 2 * Math.PI);

        var wheel_rps = speed / (Math.PI * car.properties.tire_diameter);
        var wheel_rpm = wheel_rps * 60;
        var engine_rpm = wheel_rpm * car.properties.final_drive * (smooth_shift_progress * car.properties.gear_ratios[car.data.gear - 1] + (1 - smooth_shift_progress) * car.properties.gear_ratios[car.data.previous_gear - 1]);

        return engine_rpm;
    },

    wheel_torque: function(tcar) {
        var smooth_shift_progress = Math.sin(tcar.data.shift_progress / 2 * Math.PI);

        var temp_car = JSON.parse(JSON.stringify(tcar));
        temp_car.data.shift_progress = 1;
        temp_car.data.rpm = calculator.rpm_from_speed(temp_car, temp_car.data.speed);

        var engine_rpm_new = temp_car.data.rpm;
        var engine_rpm_old = temp_car.data.rpm * (car.properties.gear_ratios[car.data.previous_gear - 1] / car.properties.gear_ratios[car.data.gear - 1]);

        var wheel_torque_new = car.engine_torque(engine_rpm_new, tcar.data.throttle) * tcar.properties.gear_ratios[tcar.data.gear - 1] * car.properties.final_drive;
        var wheel_torque_old = car.engine_torque(engine_rpm_old, tcar.data.throttle) * tcar.properties.gear_ratios[tcar.data.previous_gear - 1] * car.properties.final_drive;

        var wheel_torque = (1 - smooth_shift_progress) * wheel_torque_old + smooth_shift_progress * wheel_torque_new;

        return wheel_torque; 
    },

    wheel_force: function(tcar) {
        return calculator.wheel_torque(tcar) / (tcar.properties.tire_diameter / 2);
    },

    acceleration: function(tcar) {
        var car_accel = (calculator.wheel_force(tcar)) / tcar.properties.mass - tcar.data.brake * tcar.properties.maximum_brake_deceleration;

        var angle_accel = -1 * Math.sin(angle * Math.PI/180) * 9.81;
        var air_accel = 0;
        var rolling_accel = 0;

        if (aerodynamics === true) {
            air_accel = (-1 * 0.5 * 1.23 * (tcar.data.speed ** 2) * tcar.properties.drag_coefficient * tcar.properties.frontal_area) / tcar.properties.mass;
        }

        if (rolling_resistance === true) {
            rolling_accel = -1 * (0.01 * Math.cos((angle * 2 * Math.PI) / 360) * tcar.properties.mass * 9.81) / tcar.properties.mass;
        }

        return car_accel + angle_accel + air_accel + rolling_accel;
    }
};



window.onload = function() {
    car.properties = car_data[first_car_index].properties;
    car.sound = car_data[first_car_index].sound;

	gauges.initialize();

    if (sound === true) {
        car.sound.setup_sound();

        window.onclick = function() {
            context.resume();
        };
    }

	setInterval(frame, frame_rate);
};



function frame() {
    //get inputs
    car.data.throttle = parseInt(document.getElementById("throttle_input").value) / 100;
    car.data.brake = parseInt(document.getElementById("brake_input").value) / 100;
    angle = parseInt(document.getElementById("angle_input").value);
    aerodynamics = document.getElementById("aerodynamics_input").checked;
    rolling_resistance = document.getElementById("rolling_resistance_input").checked;


    //adjust shift progress
    if (car.data.shift_progress < 1) {
        car.data.shift_progress += 1 / car.properties.shift_time * (frame_rate / 1000) ;
    }
    if (car.data.shift_progress > 1) {
        car.data.shift_progress = 1;
    }


    //set speed and rpm
    if (car.data.rpm <= car.properties.idle_rpm && car.data.throttle <= car.properties.idle_throttle) {
        car.data.throttle = car.properties.idle_throttle;
    }

    car.data.speed = car.data.speed + calculator.acceleration(car) * (frame_rate / 1000);

    if (car.data.speed < 0) {
        car.data.speed = 0;
    }

    car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);

    if (car.data.rpm > car.properties.rpm_limiter) {
        car.data.rpm = car.properties.rpm_limiter;
        car.data.speed = calculator.speed_from_rpm(car, car.properties.rpm_limiter);
    }


    //automatic shifting
    var strategy_input_value = document.getElementById("strategy_select").value;

    switch (strategy_input_value) {
        case "r1":
            autoshift_logic_5();
            break;
        case "r2":
            autoshift_logic_5_2(); //5, aber mit besserer Maximalbeschleunigung
            break;
        case "r3":
            autoshift_logic_5_3(); //5_2, aber mit Motorbremse
            break;
        case "g1":
            autoshift_logic_4(); //gut
            break;
        case "a1":
            autoshift_logic_3(); //interessant
            break;
    }


    //sound
    if (sound === true) {
        car.sound.update_sound();
    }


    //visualization
	var street = document.getElementById("street");
	street_position_relative = parseFloat(street.style.left);

    var scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale'));

	street.style.left = (street_position_relative - car.data.speed * frame_rate / 1000 * scale) % (10 * scale) + "vw";
    document.getElementById("container").style.transform = `rotate(${-angle}deg)`;


    //frame rate calulation
    if (frame_number >= 50) {
        let current_date = Date.now();
        current_frame_rate = 1000 / ((current_date - first_frame_date) / 50);
        first_frame_date = Date.now();
        frame_number = 0;
    }

    frame_number += 1;


    //print information
    document.getElementById("additional_info_container").innerHTML = 
	    "<span>Geschwindigkeit:</span>" +
	    `<span>${(car.data.speed * 3.6).toFixed(2)} km/h</span>` +
	    "<span>Drehzahl:</span>" +
	    `<span>${car.data.rpm.toFixed(2)} U/min</span>` +
	    "<span>Gang:</span>" +
	    `<span>${car.data.gear}</span>` +
	    "<span>Vorheriger Gang:</span>" +
	    `<span>${car.data.previous_gear}</span>` +
	    "<span>Shiftprogress:</span>" +
	    `<span>${parseInt(car.data.shift_progress * 100) + "%"}</span>` +
	    "<span>Beschleunigung:</span>" +
	    `<span>${(calculator.acceleration(car)).toFixed(2)} m/s²</span>` +
	    "<span>Motordrehmoment:</span>" +
	    `<span>${car.engine_torque().toFixed(2)} Nm</span>` +
	    "<span>Raddrehmoment:</span>" +
	    `<span>${calculator.wheel_torque(car).toFixed(2)} Nm</span>` +
	    "<span>Gas:</span>" +
	    `<span>${(car.data.throttle * 100).toFixed(2) + "%"}</span>` +
	    "<span>Bremse:</span>" +
	    `<span>${car.data.brake * 100 + "%"}</span>` +
	    "<span>Steigung:</span>" +
	    `<span>${angle + "°"}; ${(Math.tan(angle * (2 * Math.PI) / 360) * 100).toFixed(2) + "%"}</span>` +
	    "<span>FPS:</span>" +
	    `<span>${current_frame_rate.toFixed(0)}`;

    gauges.update();
}
