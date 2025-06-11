Feature: Difficulty Feedback Buttons

  Scenario: Adjust difficulty using feedback
    Given the user is on the application's main page
    When the user selects the "smaller_combined_videos.json" file for upload
    Then the video data from "smaller_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    And target difficulty is set to 100
    When the user clicks "Too Hard" on the first video
    Then the target difficulty should be 95
