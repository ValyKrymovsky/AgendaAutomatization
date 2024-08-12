Feature: Invoice

@Invoice
@SystemAgenda
Scenario: Invoice basic approve
    Given Login
    And Open invoice page
    Then Fill out Invoice "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Invoice instance
    Then "Approve" Invoice request as approver
    Then Switch to user:"Test, Účetní", id:"064d68d3-93eb-4228-b08c-c66a1b2b52fe"
    Then Open Invoice instance
    Then "Approve" Invoice request as accountant
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Invoice is "Schváleno archivováno"
    Then End test


@Invoice
@SystemAgenda
Scenario: Invoice basic return
    Given Login
    And Open invoice page
    Then Fill out Invoice "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Invoice instance
    Then "Return" Invoice request as approver
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Open Invoice instance
    Then Change "wf_txt15" invoice field to "Nová zpráva pro účetní" and send
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Invoice instance
    Then "Approve" Invoice request as approver
    Then Switch to user:"Test, Účetní", id:"064d68d3-93eb-4228-b08c-c66a1b2b52fe"
    Then Open Invoice instance
    Then "Approve" Invoice request as accountant
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Invoice is "Schváleno archivováno"
    Then End test


@Invoice
@SystemAgenda
Scenario: Invoice basic deny
    Given Login
    And Open invoice page
    Then Fill out Invoice "all"
    Then Switch to user:"Test, Nadřízený_01", id:"c2728e94-97a5-490f-b1ce-9bb357933a10"
    Then Open Invoice instance
    Then "Approve" Invoice request as approver
    Then Switch to user:"Test, Účetní", id:"064d68d3-93eb-4228-b08c-c66a1b2b52fe"
    Then Open Invoice instance
    Then "Deny" Invoice request as accountant
    Then Switch to user:"Test, Uzivatel01", id:"a33e1c1b-cdd9-4132-8a52-0bddd4d2f97c"
    Then Check if Invoice is "Stornováno"
    Then End test

    