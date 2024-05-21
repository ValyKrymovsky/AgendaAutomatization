Feature: Absence


@SystemAgenda
Scenario: Absence accountant deny
    Given Login
    And Open Absence page
    Then Fill out Absence "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Absence instance
    Then "Approve" Absence request as approver
    And Wait for 180 seconds
    Then Switch to user:"Mzdová účetní, Karolína", id:"2a3b4b93-a8c4-4df3-8f03-d4fe30afc00b"
    Then Open Absence instance
    Then "Approve" Absence request as accountant
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Absence is "Schváleno archivováno"


@Absence
@SystemAgenda
Scenario: Absence positive test
    Given Login
    And Open Absence page
    Then Fill out Absence "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Absence instance
    Then "Approve" Absence request as approver
    And Wait for 180 seconds
    Then Switch to user:"Mzdová účetní, Karolína", id:"2a3b4b93-a8c4-4df3-8f03-d4fe30afc00b"
    Then Open Absence instance
    Then "Deny" Absence request as accountant
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Absence is "Stornováno"