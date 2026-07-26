## Purpose

API resources for hotel responses in the Smart Tourist Guide Morocco platform. Defines how hotel data is formatted in API responses.

## Requirements

### Requirement: HotelResource includes city data
The system SHALL include city relationship data in hotel API responses.

#### Scenario: City included in response
- **WHEN** hotel data is returned
- **THEN** response includes city object with city details

### Requirement: HotelResource includes rooms data
The system SHALL include rooms relationship data in hotel detail responses.

#### Scenario: Rooms included in detail
- **WHEN** hotel detail is retrieved
- **THEN** response includes rooms array with room details

### Requirement: HotelResource includes reviews data
The system SHALL include reviews relationship data in hotel detail responses.

#### Scenario: Reviews included in detail
- **WHEN** hotel detail is retrieved
- **THEN** response includes reviews array with review details

### Requirement: HotelResource includes average_rating
The system SHALL calculate and include average_rating from reviews in hotel responses.

#### Scenario: Average rating calculated
- **WHEN** hotel data is returned
- **THEN** response includes average_rating field with calculated average
