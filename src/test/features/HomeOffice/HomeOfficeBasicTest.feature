Feature: HomeOffice


@HomeOffice
Scenario: Home office
    Given Login
    And Open HO page
    Then Fill out HO "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    And Open HO instance
    Then "Approve" HO request
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if HO is "Schváleno archivováno"


@HomeOffice
Scenario: Home office
    Given Login
    And Open HO page
    Then Fill out HO "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    And Open HO instance
    Then "Deny" HO request
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if HO is "Zamítnuto archivováno"


@HomeOffice
Scenario: Home office
    Given Login
    And Open HO page
    Then Fill out HO "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    And Open HO instance
    Then "Return" HO request
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    And Open HO instance
    Then Change comment to "lol" and send
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    And Open HO instance
    Then "Approve" HO request
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if HO is "Schváleno archivováno"