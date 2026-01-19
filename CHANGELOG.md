# Changelog

All notable features and changes to Sokown are documented in this file.

## 2026-01-19

### Changed
- **Dependencies**: Updated server dependencies
- **Dependencies**: Updated client dependencies and fixed TypeScript types

## 2026-01-18

### Added
- **Star Map**: Added toggleable trajectory line to star map showing ship's path
- **Star Map**: Added animation effect to trajectory line for better visualization

## 2026-01-17

### Added
- **Documentation**: Added environment variables sample file and documentation

### Fixed
- **Client Tests**: Added sinon.restore() to application route test for proper cleanup

## 2026-01-16

### Added
- **Email Notifications**: Added email notification system using Nodemailer
- **User Model**: Added email and notifications preferences fields to User model
- **Arrival Notifications**: Ships now send email notifications when reaching their destination

## 2026-01-15

### Added
- **Star Map**: Display coordinates on star map when hovering over locations

### Changed
- **Refactoring**: Extracted format-coordinate helper for code reusability

## 2026-01-14

### Added
- **Documentation**: Added CLAUDE.md guidance file for AI-assisted development

## 2024-11-21

### Changed
- **Configuration**: Updated API URLs in client configuration

## 2024-05-17

### Added
- **Star Map**: Zoom levels are now saved in browser's local storage
- **Code Quality**: Added "no-console" ESLint rule to prevent console.log in production

### Fixed
- **Client**: Removed forgotten console.log statement

## 2024-05-16

### Changed
- **Star Map**: Set default zoom scale to 256 for better initial view

## 2024-05-14

### Added
- **Coordinates**: Location positions rounded to two decimal digits for cleaner display
- **Server**: API now returns rounded coordinates for improved readability

## 2024-05-13

### Added
- **Star Map**: Zoom in/out functionality for star map navigation

### Fixed
- **Client**: Ensured current user loads before locations to prevent race conditions
- **Server**: Ships now maintain their last course when reaching destination

## 2024-05-12

### Added
- **Star Map**: StarMapShip component to display ships on the map
- **Locations Service**: New service to manage location data across the app
- **Star Map**: Locations are now loaded automatically on app startup
- **Star Map**: Ships are displayed on the star map with their current position
- **Star Map**: Star map now shown on individual ship pages
- **Star Map**: Map automatically centers on the current ship
- **Star Map**: Reduced scale on ship's star map for better context

### Changed
- **Star Map**: CSS-based background for improved performance
- **Star Map**: Refactored to use real astronomical coordinates

## 2024-05-11

### Fixed
- **Server**: Corrected angle calculation between positions for accurate ship orientation

## 2024-05-09

### Added
- **Ship Navigation**: Ships now track their current course/heading
- **Ship Repository**: Added methods to get and update ship course
- **Course Calculation**: Helper function to calculate angle between two positions
- **Ship Movement**: Ship course automatically updates when moving
- **Ship API**: Course information included in ship endpoint responses
- **Ship Display**: Current course displayed on ship detail page
- **Location Colors**: Added color property to Location model for visual distinction
- **Star Map**: Locations displayed with their designated fill colors
- **Star Map**: Added lightning effect on planets for visual appeal
- **Star Map**: Bodies with very small orbit radius are automatically hidden

### Changed
- **Refactoring**: Renamed StarMapObject component to StarMapLocation for clarity

## 2024-05-08

### Added
- **Location Distance**: Calculate and return distance from primary body (the Sun)
- **Client**: Added distanceFromTheSun property to Location model

## 2024-05-06 - 2024-05-08

### Added
- **Star Map**: Initial StarMapObject component for rendering celestial bodies
- **Star Map**: Base StarMap component for visualizing the solar system

## 2024-05-05

### Added
- **Location Positions**: New endpoint to fetch location positions at specific times
- **Client**: Added ability to calculate future positions of celestial bodies

## 2024-05-03

### Added
- **Solar System**: Added Mercury and Venus as explorable locations

## 2024-05-02

### Added
- **Locations**: Individual location detail pages
- **Location Display**: Positions now shown with three decimal digits for precision

### Changed
- **Refactoring**: Removed default location positions (now calculated from astronomy data)

## 2024-04-27

### Added
- **Server**: API endpoint to fetch single location details
- **Documentation**: Added introduction, principles, and physics documentation to README

## 2024-04-26

### Added
- **Ship Timing**: Added relativeTimeToArrival method to ship model
- **Ship Display**: Relative time of arrival displayed on ship page (e.g., "in 2 hours")

## 2024-04-25

### Added
- **Dependencies**: Added Day.js library for date/time handling

## 2024-04-23

### Added
- **Ship Display**: Estimated time of arrival (ETA) shown for traveling ships
- **Autopilot UI**: Autopilot form fields are prefilled with current values
- **Autopilot UI**: Made autopilot fields required for better UX
- **Autopilot UI**: Show empty autopilot fields by default when not in use

## 2024-04-22

### Added
- **Ship Display**: Time to destination calculated and displayed
- **Ship Display**: Monospace font used for position coordinates for better readability
- **Page Titles**: Added missing page titles throughout the application
- **Units**: Converted all Sokown internal units to kilometers for real-world scale

## 2024-04-21

### Added
- **Ship Location**: Ships now save and track their current location
- **Ship Movement**: Location code automatically updates when ship reaches destination
- **Location Precision**: Location positions rounded to two decimal places

## 2024-04-15

### Added
- **Ship Database**: Added currentLocationCode column to Ship model
- **Ship Positioning**: Ship positions now update with their location's orbital movement

### Changed
- **Refactoring**: Converted use case function to class-based architecture

## 2024-04-14

### Added
- **Astronomy**: Integrated astronomy-bundle for real solar system data
- **Astronomy Service**: New service to calculate real-time positions of celestial bodies
- **Location Repository**: Added getAll method to retrieve all locations
- **Location Updates**: Location positions automatically update every minute based on real astronomy
- **Location Model**: Added setPosition method to update coordinates
- **Locations API**: New REST endpoint to fetch all celestial locations
- **Locations Page**: Added client page to browse all locations in the solar system
- **Ship Repository**: Added getAllAtLocation method to find ships at specific locations
- **Ship Names**: Validation to prevent duplicate ship names
- **Ship Repository**: Added existsForName method to check ship name availability

### Fixed
- **Code Quality**: Fixed linting errors in server code

## 2024-04-13

### Added
- **Pilot Names**: Validation to prevent duplicate pilot names during registration
- **Pilot Repository**: Added existsByPilotName method to check name availability
- **Error Handling**: Server returns 400 Bad Request when pilot name is already taken

### Changed
- **Refactoring**: Moved JsonApiError to dedicated errors folder for better organization

## 2024-04-12

### Added
- **UI Consistency**: Harmonized wording for "log in" action across the application

---

## Summary by Category

### Navigation & Movement
- Real-time ship course tracking and updates
- Autopilot system with destination, speed, and course controls
- Time to destination and ETA calculations
- Ships maintain course when reaching destination

### Star Map & Visualization
- Interactive star map with pan and zoom controls
- Ships and locations displayed with real coordinates
- Trajectory lines showing ship paths with animation
- Color-coded celestial bodies with lighting effects
- Coordinate display on hover
- Persistent zoom level preferences

### Astronomy & Locations
- Real solar system integration with astronomy-bundle
- Automatic position updates every minute based on real orbital mechanics
- Mercury, Venus, Earth, and other celestial bodies
- Distance calculations from primary bodies
- Future position prediction

### User Experience
- Email notifications when ships arrive at destinations
- Relative time display (e.g., "in 2 hours")
- Monospace fonts for coordinates
- Three-digit precision for positions
- Prefilled autopilot forms

### Data & Validation
- Unique pilot names enforcement
- Unique ship names enforcement
- Current location tracking for ships
- JSON:API compliant endpoints

### Code Quality & Architecture
- Clean/hexagonal architecture implementation
- ESLint rule preventing console.log in production
- Comprehensive test coverage
- TypeScript strict mode
- Pre-commit and pre-push hooks
