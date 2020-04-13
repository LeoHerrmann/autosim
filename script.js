/*
10vw -> 10m
speed in m/s
frame_rate in ms
*/



const frame_rate = 1000 / 60;
var frame_number = 0;
var first_frame_date = Date.now();
var current_frame_rate = 0;

const sound = true;
var context = new AudioContext();

const first_car_index = 0;

var autoshift;
var aerodynamics;
var angle = 0;



var gauges = {
    initialize: function() {
        var rpm_gauge = document.getElementById("rpm_gauge");

        for (var i = 0; i <= car.data.rpm_limiter / 1000; i++) {
            var new_indicator_text = i;
            var new_indicator_rotation = i * 1000 / car.data.rpm_limiter * (360 - 120) - 120;

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

	    rpm_gauge_needle.style.transform = `rotate(${car.data.rpm / car.data.rpm_limiter * (360 - 120) - 120}deg)`;
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

        var wheel_rpm = rpm / (smooth_shift_progress * car.data.gear_ratios[car.data.gear - 1] + (1 - smooth_shift_progress) * car.data.gear_ratios[car.data.previous_gear - 1]) / car.data.final_drive;
        var wheel_rps = wheel_rpm / 60;
        var wheel_speed =  Math.PI * car.data.tire_diameter * wheel_rps;

        return wheel_speed;
    },

    rpm_from_speed: function(car, speed) {
        var smooth_shift_progress = Math.sin(car.data.shift_progress / 2 * Math.PI);

        var wheel_rps = speed / (Math.PI * car.data.tire_diameter);
        var wheel_rpm = wheel_rps * 60;
        var engine_rpm = wheel_rpm * car.data.final_drive * (smooth_shift_progress * car.data.gear_ratios[car.data.gear - 1] + (1 - smooth_shift_progress) * car.data.gear_ratios[car.data.previous_gear - 1]);

        return engine_rpm;
    },

    wheel_torque: function(tcar) {
        return car.engine_torque(tcar.data.rpm, tcar.data.throttle) * (tcar.data.shift_progress * tcar.data.gear_ratios[tcar.data.gear - 1] + (1 - tcar.data.shift_progress) * tcar.data.gear_ratios[tcar.data.previous_gear - 1]) * tcar.data.final_drive;
    },

    wheel_force: function(tcar) {
        return calculator.wheel_torque(tcar) / (tcar.data.tire_diameter / 2);
    },

    acceleration: function(tcar) {
        var car_accel = (calculator.wheel_force(tcar) - tcar.data.maximum_braking_force * tcar.data.brake) / tcar.data.mass;
        var angle_accel = -1 * Math.sin(angle * Math.PI/180) * 9.81;
        var air_accel = 0;

        if (aerodynamics === true) {
            air_accel = (-1 * 0.5 * 1.23 * (tcar.data.speed ** 2) * tcar.data.drag_coefficient * tcar.data.frontal_area) / tcar.data.mass;
        }

        return car_accel + angle_accel + air_accel;
    }
};



function change_car(car_index) {
    context.close();
    context = new AudioContext();
    car.sound = car_data[car_index].sound;
    car.sound.setup_sound();
    car.data = car_data[car_index].data;
    gauges.clear();
    gauges.initialize();
}



window.onload = function() {
    car.data = car_data[first_car_index].data;
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
    autoshift = document.getElementById("autoshift_input").checked;
    aerodynamics = document.getElementById("aerodynamics_input").checked;


    //adjust shift progress
    if (car.data.shift_progress < 1) {
        car.data.shift_progress += 1 / car.data.shift_time * (frame_rate / 1000) ;
    }
    if (car.data.shift_progress > 1) {
        car.data.shift_progress = 1;
    }


    //set speed and rpm
    if (car.data.rpm <= car.data.idle_rpm && car.data.throttle <= car.data.idle_throttle) {
        car.data.throttle = car.data.idle_throttle;
    }

    car.data.speed = car.data.speed + calculator.acceleration(car) * (frame_rate / 1000);

    if (car.data.speed < 0) {
        car.data.speed = 0;
    }

    car.data.rpm = calculator.rpm_from_speed(car, car.data.speed);

    if (car.data.rpm > car.data.rpm_limiter) {
        car.data.rpm = car.data.rpm_limiter;
        car.data.speed = calculator.speed_from_rpm(car, car.data.rpm_limiter);
    }


    //automatic shifting
    if (autoshift == true) {
        //autoshift_logic_1(); //gut
        //autoshift_logic_3(); //gut
        autoshift_logic_4(); //gut
        //autoshift_logic_5();
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
