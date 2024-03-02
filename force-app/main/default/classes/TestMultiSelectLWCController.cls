@isTest
public class TestMultiSelectLWCController {
    @isTest static void testGetRecordName() {
        // Create a test Account
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        // Test the method with a valid Id
        Test.startTest();
        String recordName = MultiSelectLWCController.getRecordName(testAccount.Id);
        Test.stopTest();

        // Assert that the returned name is correct
        System.assertEquals('Test Account', recordName);

        // Test the method with an invalid Id
        Test.startTest();
        String nullName = MultiSelectLWCController.getRecordName('001XXXXXXXXXXXXXXX');
        Test.stopTest();

        // Assert that the returned name is null
        System.assertEquals(null, nullName);
    }
}