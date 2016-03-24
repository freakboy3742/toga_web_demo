
var toga = {
    handler: function(ref, widget) {
        if (ref === "None") {
            return function() {
                console.log("No handler defined for " + ref + " on " + widget);
            };
        } else {
            var context;
            var name;

            if (ref[0] === "(") {
                var parts = ref.slice(1,-1).split(',');
                context = document.getElementById(parts[0]).toga;
                name = parts[1];
                return function(evt) {
                    toga.vm.run_method(name, [context, widget]);
                };
            } else {
                return function(evt) {
                    toga.vm.run_method(name, [widget]);
                };
            }
        }
    }
};

$(window).load(function() {
    console.log('Create VM...');
    toga.vm = new batavia.VirtualMachine();
    console.log('Instantiate Toga objects...');
    var widgets = document.querySelectorAll('[data-toga-class]');
    var w;
    // Create widgets
    for (w = 0; w < widgets.length; w++) {
        console.log("Create " + widgets[w].dataset.togaClass + ':' + widgets[w].id);
        toga.vm.run_method('bootstrap', [widgets[w]]);
    }
    // Hook up ports
    for (w = 0; w < widgets.length; w++) {
        console.log("Set ports for " + widgets[w].dataset.togaClass + ":" + widgets[w].toga.widget_id);
        var ports = widgets[w].dataset.togaPorts.split(',');
        for (var port = 0; port < ports.length; port++) {
            var parts = ports[port].split('=');
            if (parts.length == 2 && parts[0] !== 'parent') {
                widgets[w].toga.ports[parts[0]] = parts[1];
                widgets[w].toga[parts[0]] = document.getElementById(parts[1]).toga;
            }
        }
    }
    console.log('Toga is ready.');
});