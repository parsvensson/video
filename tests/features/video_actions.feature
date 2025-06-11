Feature: Video Watch Actions

  Scenario: Watch a video and track history
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    And the watch history is cleared
    When the user clicks the watch button for the first video
    Then watch history should contain 1 entry
