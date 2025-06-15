Feature: Fetch videos from Supabase

  Scenario: Load videos automatically from Supabase
    Given the user is on the application's main page with Supabase configured
    Then a list of videos should be displayed on the page
    And the data source indicator should show "Supabase"
