Feature: Invoice

@Invoice
@SystemAgenda
Scenario: Invoice basic approve
    Given Login
    And Open invoice page
    Then Fill out Invoice "all"
    Then Switch to user:"Admin, Valy", id:"03bcc517-d325-4dc4-acfa-260c90d6eb35"
    Then Open Invoice instance
    Then "Approve" Invoice request as approver
    Then Switch to user:"Ucetní, Magda", id:"7cb41e5c-3db1-49b6-9151-8c6acee11929"
    Then Open Invoice instance
    Then "Approve" Invoice request as accountant
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Invoice is "Schváleno archivováno"
    Then End test


@SystemAgenda
Scenario: Invoice basic return
    Given Login
    And Open invoice page
    Then Fill out Invoice "all"
    Then Switch to user:"Admin, Valy", id:"03bcc517-d325-4dc4-acfa-260c90d6eb35"
    Then Open Invoice instance
    Then "Return" Invoice request as approver
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Open Invoice instance
    Then Change "wf_txt13" field to "Nová zpráva pro účetní" and send
    Then Switch to user:"Admin, Valy", id:"03bcc517-d325-4dc4-acfa-260c90d6eb35"
    Then Open Invoice instance
    Then "Approve" Invoice request as approver
    Then Switch to user:"Ucetní, Magda", id:"7cb41e5c-3db1-49b6-9151-8c6acee11929"
    Then Open Invoice instance
    Then "Approve" Invoice request as accountant
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Invoice is "Schváleno archivováno"
    Then End test

@Invoice
@SystemAgenda
Scenario: Invoice basic deny
    Given Login
    And Open invoice page
    Then Fill out Invoice "all"
    Then Switch to user:"Admin, Valy", id:"03bcc517-d325-4dc4-acfa-260c90d6eb35"
    Then Open Invoice instance
    Then "Approve" Invoice request as approver
    Then Switch to user:"Ucetní, Magda", id:"7cb41e5c-3db1-49b6-9151-8c6acee11929"
    Then Open Invoice instance
    Then "Deny" Invoice request as accountant
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Invoice is "Stornováno"
    Then End test

    