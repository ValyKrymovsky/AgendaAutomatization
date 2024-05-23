Feature: Contract

@Contract
@SystemAgenda
Scenario: Contract basic approve fill all
    Given Login
    And Open Contract page
    Then Fill out Contract "all"
    Then Switch to user:"Development 2, Lukáš", id:"36236b43-f542-4f98-a213-0fbab79eec58"
    Then Open Contract instance
    Then "Approve" Contract as approver
    Then Switch to user:"Admin, Valy", id:"03bcc517-d325-4dc4-acfa-260c90d6eb35"
    Then Open Contract instance
    Then "Approve" Contract as owner
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Contract is "Schváleno archivováno"


@SystemAgenda
Scenario: Contract basic approve fill required
    Given Login
    And Open Contract page
    Then Fill out Contract "required"
    Then Open Contract instance
    Then "Approve" Contract request as approver
    Then Open Contract instance
    Then "Deny" Contract request as accountant
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Contract is "Stornováno"