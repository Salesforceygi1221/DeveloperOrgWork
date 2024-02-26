public with sharing class MyDynamicPickerController {
    @AuraEnabled(cacheable=true)
    public static List<String> getObjectNames() {
        List<String> objectNames = new List<String>();
        for(Schema.SObjectType objType : Schema.getGlobalDescribe().Values()){
            objectNames.add(objType.getDescribe().getName());
        }
        return objectNames;
    }
}