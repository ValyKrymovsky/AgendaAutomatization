Feature: Invoice

@Invoice
@SystemAgenda
Scenario: Invoice 
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


    