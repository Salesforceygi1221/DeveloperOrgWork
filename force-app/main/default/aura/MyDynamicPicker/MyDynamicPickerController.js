// MyDynamicPickerController.js
({
    doInit : function(component, event, helper) {
        var action = component.get("c.getAllObjects");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var objectNames = response.getReturnValue();
                var targetObjects = objectNames.map(function(name) {
                    return { label: name, value: name };
                });
                component.set("v.targetObjects", targetObjects);
                component.set("v.selectedTarget", targetObjects[0].value);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },

    handleTargetSelection : function(component, event, helper) {
        var selectedTarget = event.getSource().get("v.value");
        component.set("v.selectedTarget", selectedTarget);
    }
})