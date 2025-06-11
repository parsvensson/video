Feature: Search and Filter

  Scenario: Search videos by text
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user searches for "garden"
    Then exactly 1 video should be displayed

  Scenario: Filter videos by level
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user filters by level "beginner"
    Then exactly 1 video should be displayed

  Scenario: Filter videos by sound quality
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user filters by sound quality "podcast-friendly"
    Then exactly 1 video should be displayed

  Scenario: Filter videos by guide
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user filters by guide "Sandra"
    Then exactly 2 videos should be displayed
