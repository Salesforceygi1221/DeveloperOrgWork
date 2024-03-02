public with sharing class MyDynamicPickerController {
    @AuraEnabled(cacheable=true)
    public static List<String> getObjectNames() {
        // Initialize a list to hold the names of all accessible, createable, and updateable custom objects
        List<String> customObjectNames = new List<String>();
        Try{
            // Loop through all sObject types in the org
            for(Schema.SObjectType objType : Schema.getGlobalDescribe().Values()) {
                // Get the describe result for the current sObject type
                Schema.DescribeSObjectResult describeResult = objType.getDescribe();
                // Check if the object is custom and has a 'Name' field
                if (describeResult.isCustom() && describeResult.fields.getMap().containsKey('Name') && 
                    describeResult.fields.getMap().get('Name').getDescribe().isAccessible()) {
                        // Check if the object is accessible, createable, and updateable
                        if (describeResult.isAccessible() && describeResult.isCreateable() && describeResult.isUpdateable()) {
                            // If the object meets the criteria, add its name to the list
                            customObjectNames.add(describeResult.getName());
                        }
                    }
            }
            // Sort the list of custom object names
            customObjectNames.sort();
            
            // Return the sorted list of custom object names
            return customObjectNames;
        }
        Catch(Exception Excep){
            System.debug('Error Message is: '+Excep.getMessage()+' and line Number of Exception is: '+Excep.getLineNumber());
            return null;
        }
    } 
}