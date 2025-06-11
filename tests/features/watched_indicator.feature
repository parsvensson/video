Feature: Watched Video Indicator

  Scenario: Display watched indicator on video card
    Given I have previously watched the video "Introduction to AI"
    When I am on the main page
    Then I should see a "Watched" indicator on the video card for "Introduction to AI"

  Scenario: No watched indicator for unwatched videos
    Given I have not watched the video "Advanced Machine Learning"
    When I am on the main page
    Then I should not see a "Watched" indicator on the video card for "Advanced Machine Learning"

  Scenario: Indicator updates after watching a video via button
    Given I am on the main page
    And I have not watched the video "Neural Networks Explained"
    And the video "Neural Networks Explained" exists in the loaded data
    When I click the "Watch on YouTube" button for the video titled "Neural Networks Explained"
    Then I should see a "Watched" indicator on the video card for "Neural Networks Explained"
