Feature: PurchaseRequest

@PurchaseRequest
@SystemAgenda
Scenario: Purchase request basic approve
    Given Login
    And Open Purchase request page
    Then Fill out Purchase request "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Purchase request instance
    Then "Approve" Purchase request as center manager
    Then Switch to user:"Test, Nadřízený_02", id:"0b6b803d-fdd5-40cc-9453-0c7014a638fc"
    Then Open Purchase request instance
    Then "Approve" Purchase request as purchase manager
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Purchase request is "Schváleno archivováno"
    Then End Purchase request test

@SystemAgenda
Scenario: Purchase request basic deny 1
    Given Login
    And Open Purchase request page
    Then Fill out Purchase request "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Purchase request instance
    Then "Deny" Purchase request as center manager
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Purchase request is "Zamítnuto archivováno"
    Then End Purchase request test

@PurchaseRequest
@SystemAgenda
Scenario: Purchase request basic deny 2
    Given Login
    And Open Purchase request page
    Then Fill out Purchase request "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Purchase request instance
    Then "Approve" Purchase request as center manager
    Then Switch to user:"Test, Nadřízený_02", id:"0b6b803d-fdd5-40cc-9453-0c7014a638fc"
    Then Open Purchase request instance
    Then "Deny" Purchase request as purchase manager
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Purchase request is "Zamítnuto archivováno"
    Then End Purchase request test