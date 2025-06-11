Feature: Toggle Video Details

  Scenario: Expand and collapse details
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user toggles details on the first video
    Then the video details should be visible
    When the user toggles details on the first video
    Then the video details should be hidden
