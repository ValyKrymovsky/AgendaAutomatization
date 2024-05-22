Feature: PurchaseRequest

@PurchaseRequest
@SystemAgenda
Scenario: Purchase request basic approve
    Given Login
    And Open Purchase request page
    Then Fill out Purchase request "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Purchase request instance
    Then "Approve" Purchase request as center manager
    Then Open Purchase request instance
    Then "Approve" Purchase request as purchase manager
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Purchase request is "Schváleno archivováno"
    Then End Purchase request test

@PurchaseRequest
@SystemAgenda
Scenario: Purchase request basic deny 1
    Given Login
    And Open Purchase request page
    Then Fill out Purchase request "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Purchase request instance
    Then "Deny" Purchase request as center manager
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Purchase request is "Zamítnuto archivováno"
    Then End Purchase request test

@PurchaseRequest
@SystemAgenda
Scenario: Purchase request basic deny 2
    Given Login
    And Open Purchase request page
    Then Fill out Purchase request "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Purchase request instance
    Then "Approve" Purchase request as center manager
    Then Open Purchase request instance
    Then "Deny" Purchase request as purchase manager
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Purchase request is "Zamítnuto"
    Then End Purchase request test