Feature: Contract


@Contract
@SystemAgenda
Scenario: Contract basic approve fill all
    Given Login
    Then Enable debug mode
    And Open Contract page
    Then Fill out Contract "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Contract instance
    Then "Approve" Contract as approver
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    Then "Approve" Contract as owner
    Then Open Contract instance
    Then "Archive" Contract
    Then Check if Contract is "Schváleno archivováno"
    Then End Contract test


@Contract
@SystemAgenda
Scenario: Contract basic return from approver
    Given Login
    And Open Contract page
    Then Fill out Contract "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Contract instance
    Then "Return" Contract as approver
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    And Send returned Contract
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Contract instance
    Then "Approve" Contract as approver
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    Then "Approve" Contract as owner
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    Then "Archive" Contract
    Then Check if Contract is "Schváleno archivováno"
    Then End Contract test


@Contract
@SystemAgenda
Scenario: Contract basic return from owner
    Given Login
    And Open Contract page
    Then Fill out Contract "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Contract instance
    Then "Approve" Contract as approver
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    Then "Return" Contract as owner
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    And Send returned Contract
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Contract instance
    Then "Approve" Contract as approver
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    Then "Approve" Contract as owner
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Contract instance
    Then "Archive" Contract
    Then Check if Contract is "Schváleno archivováno"
    Then End Contract test