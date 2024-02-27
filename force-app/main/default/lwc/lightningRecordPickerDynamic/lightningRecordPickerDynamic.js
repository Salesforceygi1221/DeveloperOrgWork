import { LightningElement, wire, track, } from 'lwc';

import getObjectNames from "@salesforce/apex/MyDynamicPickerController.getObjectNames";
export default class lightningRecordPickerDynamic extends LightningElement {
    @track targetObjects = [
        { label: 'Account', value: 'Account' },
        { label: 'Contact', value: 'Contact' },
        { label: 'Lead', value: 'Lead' },
        { label: 'Opportunity', value: 'Opportunity' },
        { label: 'Case', value: 'Case' }
    ];
    selectedTarget = '';
    currentSelectedRecordId = null;
    @track isLoading = true;

    // Wire the getAllObjects Apex method to the wiredObjects function
    @wire(getObjectNames)
    wiredObjects({ error, data }) {
        try {
            // If data is returned
            if (data) {
                console.log('@@@data org', data);
                // Map the data to the targetObjects array
                this.targetObjects = [...this.targetObjects, ...data.map(obj => ({ label: obj, value: obj }))];

                // Set the selectedTarget to the first object in the list
                if (this.targetObjects.length > 0) {
                    this.selectedTarget = this.targetObjects[0].value;
                }

                // Log the targetObjects array
                console.log('@@@data', this.targetObjects);
                // Set isLoading to false to hide the loading spinner
                this.isLoading = false;
            }
            // If an error occurred
            else if (error) {
                // Log the error
                console.error(error);
                // Set isLoading to false to hide the loading spinner
                this.isLoading = false;
            }
        } catch (excep) {
            console.error('An error occurred: ', excep);
        }
    }


    displayInfos = {
        Account: {
            additionalFields: ['Type']
        },
        Contact: {
            additionalFields: ['Phone']
        },
        Opportunity: {
            additionalFields: ['StageName']
        },
        Case: {
            additionalFields: ['Subject']
        },
        Lead: {
            additionalFields: ['Status']
        }

    };

    matchingInfos = {
        Account: {
            additionalFields: [{ fieldPath: 'Type' }]
        },
        Contact: {
            additionalFields: [{ fieldPath: 'Phone' }]
        },
        Opportunity: {
            additionalFields: [{ fieldPath: 'StageName' }]
        },
        Case: {
            additionalFields: [{ fieldPath: 'Subject' }]
        },
        Lead: {
            additionalFields: [{ fieldPath: 'Status' }]
        }
    };

    get displayInfo() {
        return this.displayInfos[this.selectedTarget];
    }

    get matchingInfo() {
        return this.matchingInfos[this.selectedTarget];
    }

    get showTargetSelector() {
        return this.currentSelectedRecordId === null;
    }

    handleTargetSelection(event) {
        event.stopPropagation();
        this.selectedTarget = event.target.value;
    }

    handleRecordSelect(event) {
        this.currentSelectedRecordId = event.detail.recordId;
    }
}