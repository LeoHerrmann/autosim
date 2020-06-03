var stopwatch = {
    time: 0,
    running: false,

    acceleration_times: {
        "50": 0,
        "100": 0,
        "200": 0
    },

    update: function() {
        stopwatch.time = Math.round(stopwatch.time + frame_rate);
        let stopwatch_label = document.getElementById("stopwatch_value"); 
        stopwatch_label.innerText = stopwatch.make_milliseconds_readable(stopwatch.time);

        for (let velocity in stopwatch.acceleration_times) {
            if (stopwatch.acceleration_times[velocity] == 0 && car.data.speed * 3.6 > velocity) {
                stopwatch.acceleration_times[velocity] = stopwatch.time;

                let acceleration_time_label = document.querySelector('[data-velocity="' + velocity + '"]');
                acceleration_time_label.innerHTML = velocity + ": " + stopwatch.make_milliseconds_readable(stopwatch.time) +
                                                    "<button onclick='stopwatch.remove_measurement_point(this);'>-</button></div>";
            }
        }
    },

    toggle: function() {
        let start_button = document.getElementById("stopwatch_start_button");

        if (stopwatch.running === false) {
            stopwatch.running = true;
            start_button.innerText = "Stopp";
        }
        else {
            stopwatch.running = false;
            start_button.innerText = "Start";
        }
    },

    reset: function() {
        stopwatch.running = false;
        stopwatch.time = 0;

        document.getElementById("stopwatch_value").innerText = "00:00:00";
        document.getElementById("stopwatch_start_button").innerText = "Start";

        let acceleration_time_labels = document.getElementsByClassName("acceleration_time_label");

        while (acceleration_time_labels.length > 0) {
            acceleration_time_labels[0].remove();
        }

        let measurements_container = document.getElementById("measurements_container");

        for (let velocity in stopwatch.acceleration_times) {
            stopwatch.acceleration_times[velocity] = 0;

            measurements_container.innerHTML += "<div class='acceleration_time_label' data-velocity='" + 
                                                      velocity + "'>" + velocity + ": --:--:--" +
                                                      "<button onclick='stopwatch.remove_measurement_point(this);'>-</button></div>";
        }
    },

    make_milliseconds_readable(time_in_ms) {
        return Math.floor(stopwatch.time / 1000 / 60).toString().padStart(2, "0") + ":" +
               Math.floor(stopwatch.time / 1000 % 60).toString().padStart(2, "0") + ":" + 
               Math.floor(stopwatch.time % 1000 / 10).toString().padStart(2, "0");
    },

    add_measurement_point: function() {
        let velocity = document.getElementById("measurement_point_input").value;

        stopwatch.acceleration_times[velocity.toString()] = 0;

        let measurements_container = document.getElementById("measurements_container");
        measurements_container.innerHTML += "<div class='acceleration_time_label' data-velocity='" + 
                                                  velocity + "'>" + velocity + ": --:--:--" +
                                                  "<button onclick='stopwatch.remove_measurement_point(this);'>-</button></div>";
    },

    remove_measurement_point: function(clicked_button) {
        let acceleration_time_label = clicked_button.parentElement;
        let velocity = clicked_button.parentElement.getAttribute("data-velocity");

        delete stopwatch.acceleration_times[velocity];
        acceleration_time_label.remove();
    }
};
