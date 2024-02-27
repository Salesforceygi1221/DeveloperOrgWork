@isTest
private class MyDynamicPickerControllerTest {

    @isTest static void testGetObjectMethod() {
        // Call the method to test
        List<String> result = MyDynamicPickerController.getObjectNames();
        System.assertNotEquals(null, result, 'The returned list should not be null');
        System.assert(result.size() > 0, 'The returned list should not be empty');
    }
}