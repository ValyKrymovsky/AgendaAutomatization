Feature: HomeOffice

@HomeOffice
Scenario: Home office
    Given Login
    And Open HO page
    Then Fill out HO "required"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    And Open HO instance
    Then "Return" HO request
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    And Open HO instance
    Then Change "wf_txt0" field to "Proč vráceno???" and send
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    And Open HO instance
    Then "Approve" HO request
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if HO is "Schváleno archivováno"