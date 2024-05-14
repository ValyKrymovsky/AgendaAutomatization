Feature: SignPoint

  @test
  Scenario: SignPoint only user sign
    Given Succes Login
    Given SignPoint page open
    Then Try sign and chcek warning
    Then Fill SignPoint and check data
    And Sign SignPoint with cert
    And Send to archive
    Then Go on closed and verify SP
