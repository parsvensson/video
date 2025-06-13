Feature: Filter by clicking tags and guides

  Scenario: Click tag to filter videos
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user clicks the tag "daily life"
    Then exactly 3 videos should be displayed

  Scenario: Click guide to filter videos
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user clicks the guide "Sandra"
    Then exactly 2 videos should be displayed
