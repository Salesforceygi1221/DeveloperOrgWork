import { LightningElement, wire, track, api } from 'lwc';
import getRecordName from '@salesforce/apex/MultiSelectLWCController.getRecordName';
import getObjectNames from "@salesforce/apex/MyDynamicPickerController.getObjectNames";

export default class forMultipleObjectMultiSelectRecordPicker extends LightningElement {
    @api isMultiSelect = !(false);

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
    @track selectedItems = []

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

    handleItemRemove(event) {
        const name = event.detail.item.name;
        this.selectedItems = this.selectedItems.filter(item => name !== item.name);
    }

    handleTargetSelection(event) {
        event.stopPropagation();
        this.selectedTarget = event.target.value;
    }

    handleRecordSelect(event) {
        let recordId = event.detail.recordId;
        if (this.isMultiSelect) {
            event.target.value = null; // Clear the input field

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
                        iconName: this.iconName,
                        alternativeText: this.label,
                        isLink: true
                    });
                }).catch(err => console.error(err));
            } else {
                // Remove deselected item from the list
                this.selectedItems = this.selectedItems.filter(item => this.recordId !== item.name);
            }
        }
        this.currentSelectedRecordId = recordId; // Update the current selected ID
    }
}