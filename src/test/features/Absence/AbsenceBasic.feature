Feature: Absence

@Absence
@SystemAgenda
Scenario: Absence accountant deny
    Given Login
    And Open Absence page
    Then Fill out Absence "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Absence instance
    Then "Approve" Absence request as approver
    And Wait for 60 seconds
    Then Switch to user:"Test, Účetní", id:"064d68d3-93eb-4228-b08c-c66a1b2b52fe"
    Then Open Absence instance
    Then "Approve" Absence request as accountant
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Absence is "Schváleno archivováno"


@Absence
@SystemAgenda
Scenario: Absence positive test
    Given Login
    And Open Absence page
    Then Fill out Absence "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Absence instance
    Then "Approve" Absence request as approver
    And Wait for 60 seconds
    Then Switch to user:"Test, Účetní", id:"064d68d3-93eb-4228-b08c-c66a1b2b52fe"
    Then Open Absence instance
    Then "Deny" Absence request as accountant
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Absence is "Stornováno"