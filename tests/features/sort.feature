Feature: Video Sorting

  Scenario: Sort videos by newest
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user sorts by "publishedAt"
    Then the first video title should be "Grapes for New Year's eve"

  Scenario: Sort videos by duration
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user sorts by "duration"
    Then the first video title should be "Why the cat isn't in the Chinese zodiac"

  Scenario: Sort videos by title
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user sorts by "title"
    Then the first video title should be "Apps I use"

  Scenario: Sort videos by difficulty
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    When the user sorts by "difficultyScore"
    Then the first video title should be "I show you my garden"
