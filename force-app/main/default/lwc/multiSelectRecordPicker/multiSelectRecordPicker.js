import { LightningElement, api, track } from 'lwc';
import getRecordName from '@salesforce/apex/MultiSelectLWCController.getRecordName';

export default class MultiSelectRecordPicker extends LightningElement {
    // Public properties (can be set from parent components)
    @api isMultiSelect = !(false); // Determines whether multi-select is enabled
    @api objectName = 'Contact'; // Salesforce object name (e.g., 'Account', 'Contact')
    @api label = 'Contacts'; // Label for the component
    @api iconName = 'standard:contact'; // Icon name for display

    // Private properties (tracked for reactivity)
    selectedId;
    @track selectedItems = []; // List of selected items (records)

    // Event handler for record selection
    handleChange(event) {
        let recordId = event.detail.recordId;
        if (this.isMultiSelect) {
            event.target.value = null; // Clear the input field
            this.template.querySelector('lightning-record-picker').clearSelection();
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
                this.selectedItems = this.selectedItems.filter(item => this.selectedId !== item.name);
            }
        }
        this.selectedId = recordId; // Update the current selected ID
    }

    // Event handler for removing selected item
    handleItemRemove(event) {
        const name = event.detail.item.name;
        this.selectedItems = this.selectedItems.filter(item => name !== item.name);
    }
}