Feature: Clear Filters

  Scenario: Clear all active filters
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user searches for "garden"
    Then exactly 1 video should be displayed
    When the user clears all filters
    Then exactly 8 videos should be displayed
