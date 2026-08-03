/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone
 * @property {string} role
 * @property {string} status
 * @property {boolean} active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} City
 * @property {number} city_id
 * @property {string} name
 * @property {string} region
 * @property {string} description
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Attraction
 * @property {number} attraction_id
 * @property {number} city_id
 * @property {string} name
 * @property {string} description
 * @property {string} address
 * @property {string} opening_hours
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Hotel
 * @property {number} hotel_id
 * @property {number} city_id
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 * @property {string} email
 * @property {string} description
 * @property {number} stars
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Room
 * @property {number} room_id
 * @property {number} hotel_id
 * @property {string} number
 * @property {string} type
 * @property {number} capacity
 * @property {number} price_per_night
 * @property {boolean} available
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Driver
 * @property {number} driver_id
 * @property {number} user_id
 * @property {number} city_id
 * @property {string} license_number
 * @property {number} years_of_experience
 * @property {string[]} languages
 * @property {boolean} available
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Vehicle
 * @property {number} vehicle_id
 * @property {number} driver_id
 * @property {string} brand
 * @property {string} model
 * @property {string} type
 * @property {number} seats
 * @property {string} registration_number
 * @property {boolean} air_conditioning
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} HotelBooking
 * @property {number} booking_id
 * @property {number} user_id
 * @property {number} hotel_id
 * @property {number} room_id
 * @property {string} check_in_date
 * @property {string} check_out_date
 * @property {number} total_price
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} TransportBooking
 * @property {number} booking_id
 * @property {number} user_id
 * @property {number} driver_id
 * @property {number} vehicle_id
 * @property {string} pickup_location
 * @property {string} dropoff_location
 * @property {string} date
 * @property {string} time
 * @property {number} total_price
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Review
 * @property {number} review_id
 * @property {number} user_id
 * @property {number} rating
 * @property {string} comment
 * @property {number} hotel_id
 * @property {number} driver_id
 * @property {number} attraction_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Favorite
 * @property {number} favorite_id
 * @property {number} user_id
 * @property {number} hotel_id
 * @property {number} restaurant_id
 * @property {number} attraction_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {*} data
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success
 * @property {string} message
 * @property {*[]} data
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} per_page
 * @property {number} total
 */

/**
 * @typedef {Object} ItineraryDay
 * @property {number} day_id
 * @property {number} itinerary_id
 * @property {number} day_number
 * @property {string} title
 * @property {string} description
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Itinerary
 * @property {number} itinerary_id
 * @property {number} user_id
 * @property {number} city_id
 * @property {string} title
 * @property {string} description
 * @property {string} start_date
 * @property {string} end_date
 * @property {ItineraryDay[]} days
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} password
 * @property {string} password_confirmation
 * @property {string} phone
 */

/**
 * @typedef {Object} CreateBookingPayload
 * @property {number} hotel_id
 * @property {number} room_id
 * @property {string} check_in_date
 * @property {string} check_out_date
 */