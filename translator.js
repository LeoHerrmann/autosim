//Management of multilingual support


window.addEventListener("load", function() {
    language = localStorage.getItem("autosim_language");

    if (language === null) {
        language = "en";
        localStorage.setItem("autosim_language", "en");
    }

    translator.translate_page(language);

    var language_inputs = document.querySelectorAll("[name=language_input]");

    for (let element of language_inputs) {
        if (element.getAttribute("value") == language) {
            element.checked = true;
        }

        element.onchange = function() {
            language = document.querySelector("[name=language_input]:checked").value;
            translator.translate_page(language);
            localStorage.setItem("autosim_language", language);
        };
    }
});



const translator = {
    translate: function(key, language) {
        return translator.translations[key][language];
    },



    translate_page: function(language) {
        var elements_to_translate = document.querySelectorAll("[data-translation-key]");

        for (let element of elements_to_translate) {
            let translation_key = element.getAttribute("data-translation-key");
            element.innerText = translator.translate(translation_key, language);
        }

        document.getElementById("measurement_point_input").setAttribute("placeholder", translator.translate("new_value", language));
    },



    translations: {
        "instruments": {
            "en": "Instruments", "de": "Instrumente"
        },

        "information": {
            "en": "Information", "de": "Informationen"
        },

        "velocity:": {
            "en": "Velocity:", "de": "Geschwindigkeit:"
        },

        "engine_speed:": {
            "en": "Engine speed:", "de": "Motordrehzahl:"
        },

        "rpm": {
            "en": "rpm", "de": "U/min"
        },

        "current_gear:": {
            "en": "Current gear:", "de": "Aktueller Gang:"
        },

        "previous_gear:": {
            "en": "Previous gear:", "de": "Vorheriger Gang:"
        },

        "shift_progress:": {
            "en": "Shift progress:", "de": "Schaltfortschritt:"
        },

        "acceleration:": {
            "en": "Acceleration:", "de": "Beschleunigung:"
        },

        "engine_torque:": {
            "en": "Engine torque:", "de": "Motordrehmoment:"
        },

        "wheel_torque:": {
            "en": "Wheel torque:", "de": "Raddrehmoment:"
        },

        "throttle:": {
            "en": "Throttle:", "de": "Gas:"
        },

        "brake:": {
            "en": "Brake:", "de": "Bremse:"
        },

        "slope:": {
            "en": "Slope:", "de": "Steigung:"
        },

        "frame_rate:": {
            "en": "Frame rate:", "de": "Bildrate:"
        },

        "language": {
            "en": "Language", "de": "Sprache"
        },

        "english": {
            "en": "English", "de": "Englisch"
        },

        "german": {
            "en": "German", "de": "Deutsch"
        },

        "vehicle": {
            "en": "Vehicle", "de": "Fahrzeug"
        },

        "vehicle": {
            "en": "Vehicle", "de": "Fahrzeug"
        },

        "strategy": {
            "en": "Strategy", "de": "Strategie"
        },

        "manual": {
            "en": "Manual", "de": "Manuell"
        },

        "engine_speed_1": {
            "en": "Engine speed 1 (foundation)", "de": "Motordrehzahl 1 (Grundlage)"
        },

        "engine_speed_2": {
            "en": "Engine speed 2 (improved acceleration)", "de": "Motordrehzahl 2 (Verbesserte Beschleunigung)"
        },

        "engine_speed_3": {
            "en": "Engine speed 3 (automatic engine braking)", "de": "Motordrehzahl 3 (Automatische Motorbrese)"
        },

        "gearing": {
            "en": "Gearing", "de": "Übersetzung"
        },

        "acceleration": {
            "en": "Acceleration", "de": "Beschleunigung"
        },

        "engine_start": {
            "en": "Start engine", "de": "Motor starten"
        },

        "brake": {
            "en": "Brake", "de": "Bremse"
        },

        "throttle": {
            "en": "Throttle", "de": "Last"
        },

        "driving_resistances": {
            "en": "Driving resistances", "de": "Fahrwiderstände"
        },

        "slope": {
            "en": "Slope", "de": "Steigung"
        },

        "air_resistance": {
            "en": "Air resistance", "de": "Luftwiderstand"
        },

        "rolling_resistance": {
            "en": "Rolling resistance", "de": "Rollwiderstand"
        },

        "stopwatch": {
            "en": "Stopwatch", "de": "Stoppuhr"
        },

        "start": {
            "en": "Start", "de": "Start"
        },

        "reset": {
            "en": "Reset", "de": "Reset"
        },

        "start_with_engine": {
            "en": "Start with engine", "de": "Mit Motor starten"
        },

        "measurements": {
            "en": "Measurements", "de": "Messungen"
        },

        "new_value": {
            "en": "New value", "de": "Neuer Wert"
        }
    }
};
