Feature: File Upload Functionality

  Scenario: Successfully upload video data file
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
