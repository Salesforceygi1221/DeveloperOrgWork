import { LightningElement, wire, track, api } from 'lwc';
import getRecordName from '@salesforce/apex/MultiSelectLWCController.getRecordName';
import getObjectNames from "@salesforce/apex/MyDynamicPickerController.getObjectNames";

// Define the class forMultipleObjectMultiSelectRecordPicker
export default class forMultipleObjectMultiSelectRecordPicker extends LightningElement {
    // Define the API and track decorators
    @api isMultiSelect = !(false); // API decorator for isMultiSelect

    // Define the targetObjects array
    @track targetObjects = [
        { label: 'Account', value: 'Account' },
        { label: 'Contact', value: 'Contact' },
        { label: 'Lead', value: 'Lead' },
        { label: 'Opportunity', value: 'Opportunity' },
        { label: 'Case', value: 'Case' }
    ];
    selectedTarget = ''; // Define the selectedTarget variable
    currentSelectedRecordId = null; // Define the currentSelectedRecordId variable
    @track isLoading = true; // Track decorator for isLoading
    @track selectedItems = [] // Track decorator for selectedItems

    // Wire the getAllObjects Apex method to the wiredObjects function
    @wire(getObjectNames)
    wiredObjects({ error, data }) {
        try {
            // If data is returned
            if (data) {
                console.log('@@@data org: ', data);
                // Map the data to the targetObjects array
                this.targetObjects = [...this.targetObjects, ...data.map(obj => ({ label: obj, value: obj }))];

                // Set the selectedTarget to the first object in the list
                if (this.targetObjects.length > 0) {
                    this.selectedTarget = this.targetObjects[0].value;
                }

                // Log the targetObjects array
                console.log('@@@data: ', this.targetObjects);
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

    // Define the displayInfos object
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

    // Define the matchingInfos object
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

    // Define the getter for displayInfo
    get displayInfo() {
        return this.displayInfos[this.selectedTarget];
    }

    // Define the getter for matchingInfo
    get matchingInfo() {
        return this.matchingInfos[this.selectedTarget];
    }

    // Define the getter for showTargetSelector
    get showTargetSelector() {
        return this.currentSelectedRecordId === null;
    }

    // Define the handleItemRemove function
    handleItemRemove(event) {
        const name = event.detail.item.name;
        this.selectedItems = this.selectedItems.filter(item => name !== item.name);
    }

    // Define the handleTargetSelection function
    handleTargetSelection(event) {
        try {
            event.stopPropagation();
            this.selectedTarget = event.target.value;
            console.log('Selected Object:', this.selectedTarget.toLowerCase());
            this.selectedItems = [];
        } catch (error) {
            console.log('Handle Target Selection Error: ', error);
        }
    }

    // Define the handleRecordSelect function
    handleRecordSelect(event) {
        let recordId = event.detail.recordId;
        console.log('Before (this.isMultiSelect): ', event.detail.value);
        if (this.isMultiSelect) {
            event.detail.value = null; // Clear the input field
            console.log('(After this.isMultiSelect): ', event.detail.value);
            if (recordId) {
                // Fetch the record name using an Apex method
                getRecordName({ recordId }).then(label => {
                    // Update selected items list
                    this.selectedItems = this.selectedItems.filter(item => recordId !== item.name);
                    this.selectedItems.push({
                        type: 'icon',
                        href: `/${recordId}`,
                        name: recordId,
                        label,
                        iconName: 'standard:' + this.selectedTarget.toLowerCase(),
                        alternativeText: this.label,
                        isLink: true
                    });
                }).catch(err => console.error('Handle Record Select Error: ', err));
            } else {
                // Remove deselected item from the list
                this.selectedItems = this.selectedItems.filter(item => this.recordId !== item.name);
            }
        }
        this.currentSelectedRecordId = recordId; // Update the current selected ID
    }
}