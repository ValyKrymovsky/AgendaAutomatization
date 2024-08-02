Feature: TravelOrder

@TravelOrder
@SystemAgenda
Scenario: Travel order basic approve
    Given Login
    And Open Travel order page
    Then Fill out Travel order "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Travel order instance
    Then Open Travel order instance
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Travel order is "Schváleno archivováno"
    Then End Travel order test

@SystemAgenda
Scenario: Travel order basic deny 1
    Given Login
    And Open Travel order page
    Then Fill out Travel order "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Travel order instance
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Travel order is "Zamítnuto archivováno"
    Then End Travel order test

@TravelOrder
@SystemAgenda
Scenario: Travel order basic deny 2
    Given Login
    And Open Travel order page
    Then Fill out Travel order "all"
    Then Switch to user:"President, Petr", id:"605de872-8404-4c70-b7b3-50db3d6406b4"
    Then Open Travel order instance
    Then Switch to user:"Development 1, Karel", id:"9e460476-d735-4873-b564-e360efb460e8"
    Then Check if Travel order is "Zamítnuto"
    Then End Travel order test