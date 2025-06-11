Feature: Pagination Controls

  Scenario: Navigate between pages
    Given the user is on the application's main page
    When the user selects the "medium_combined_videos.json" file for upload
    Then the video data from "medium_combined_videos.json" should be loaded
    And a list of videos should be displayed on the page
    Then the page indicator should show "Page 1 of 2"
    When the user goes to the next page
    Then the page indicator should show "Page 2 of 2"
    When the user goes to the previous page
    Then the page indicator should show "Page 1 of 2"
