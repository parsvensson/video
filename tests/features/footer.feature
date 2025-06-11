Feature: Footer Verification
  As a user
  I want to see the copyright information in the footer
  So that I know the application is up-to-date

  Scenario: Verify footer content
    Given I have loaded the videos page
    Then I should see "VideoBrowser" in the footer
