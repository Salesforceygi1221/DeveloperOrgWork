public with sharing class MultiSelectLWCController {
    // An Aura-enabled method to retrieve the name of a record based on its ID
    @AuraEnabled(cacheable = true)
    public static string getRecordName(Id recordId) {
        try {
            // Construct a dynamic SOQL query to fetch the record name
            return (String)Database.query('SELECT Id, Name FROM ' + recordId.getSObjectType().getDescribe().getName() + ' WHERE Id=:recordId')[0]?.get('Name');
        }
        catch (Exception excep) {
            // Handle any exceptions (e.g., invalid query, null recordId)
            System.debug('Error Message is: ' + excep.getMessage() + ' and line Number of Exception is: ' + excep.getLineNumber());
            return null; // Return null if an error occurs
        }
    }
}