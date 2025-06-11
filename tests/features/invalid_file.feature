Feature: Invalid File Handling

  Scenario: Show an error for invalid JSON
    Given the user is on the application's main page
    When the user selects the "invalid.txt" file for upload
    Then an error message should be displayed
