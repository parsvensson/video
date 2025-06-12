Feature: Export and Import Application State

  Scenario: Export state after watching a video and import it back
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    And the user clicks the watch button for the first video
    And the user exports the application state
    Then a state file should be downloaded containing the watched video
    When the user reloads the page and clears all data
    And the user imports the previously exported state
    Then the imported watch history should contain 1 entry

  Scenario: Export state and verify clearing resets history
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    And the user clicks the watch button for the first video
    And the user exports the application state
    When the user reloads the page and clears all data
    Then the imported watch history should contain 0 entry

