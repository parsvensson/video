Feature: View History Dialog

  Scenario: Open and close the View History dialog
    Given the user is on the main page
    When the user clicks on the "View History" button
    Then the "View History" dialog should be displayed
    When the user clicks on the close button of the "View History" dialog
    Then the "View History" dialog should be closed

  Scenario: View History with items
    Given the user has watched some videos
    When the user clicks on the "View History" button
    Then the "View History" dialog should be displayed
    And the "View History" dialog should show a list of watched videos
    When the user clicks on the close button of the "View History" dialog
    Then the "View History" dialog should be closed


  Scenario: View History when empty
    Given the user has not watched any videos
    When the user clicks on the "View History" button
    Then the "View History" dialog should be displayed
    And the "View History" dialog should show an "empty history" message
    When the user clicks on the close button of the "View History" dialog
    Then the "View History" dialog should be closed
