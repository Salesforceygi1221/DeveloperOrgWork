import { LightningElement } from 'lwc';


export default class lightningRecordPickerDynamic extends LightningElement {
    targetObjects = [{
            label: 'Account',
            value: 'Account'
        },
        {
            label: 'Contact',
            value: 'Contact'
        },
        {
            label: 'Opportunity',
            value: 'Opportunity'
        },
        {
            label: 'Case',
            value: 'Case'
        }
    ];

    selectedTarget = 'Account';
    currentSelectedRecordId = null;

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
        // Prevent lightning-combobox `change` event from bubbling
        event.stopPropagation();

        this.selectedTarget = event.target.value;
        // this.refs.recordPicker.clearSelection();
    }

    handleRecordSelect(event) {
        this.currentSelectedRecordId = event.detail.recordId;
    }
}