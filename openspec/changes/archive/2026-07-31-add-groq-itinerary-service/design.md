## Context

The project needs AI-powered itinerary generation. The route `POST /api/v1/ai/itinerary` exists but the controller is missing. The attractions table has name, description, address, opening_hours, average_rating, and city_id. No AI SDK is installed, but Laravel's HTTP client is available.

Current state:
- Route declared but controller missing
- No AI service exists
- No caching implementation in code
- Attractions data available for prompt construction

## Goals / Non-Goals

**Goals:**
- Create AiItineraryService using Groq API (Llama 3)
- Generate structured day-by-day itineraries
- Support preferences: adventure, cultural, relaxation
- Support budget levels: LOW, MEDIUM, HIGH
- Cache results to prevent redundant API calls
- Handle API errors gracefully

**Non-Goals:**
- Multi-city itineraries
- Real-time availability checking
- Booking integration
- Image generation

## Decisions

**1. Groq API over Claude**
- **Decision**: Use Groq API with Llama 3 model
- **Why**: Free tier available, fast inference, good for structured output
- **Alternative**: Claude API - requires paid account

**2. File Cache over Redis**
- **Decision**: Use Laravel's file/database cache
- **Why**: Already configured, no additional infrastructure
- **Alternative**: Redis - faster but requires separate service

**3. Budget as Enum**
- **Decision**: Use LOW/MEDIUM/HIGH instead of numeric budget
- **Why**: Simpler for users, AI can interpret better
- **Alternative**: Numeric budget - more precise but harder UX

**4. Prompt Engineering**
- **Decision**: Construct detailed prompt with attraction data and constraints
- **Why**: Better structured output from LLM
- **Alternative**: Simple prompt - less reliable output format

## Risks / Trade-offs

- **Risk**: Groq API rate limits → **Mitigation**: Cache results, handle 429 errors
- **Risk**: LLM output format inconsistent → **Mitigation**: Parse and validate response
- **Risk**: API key exposure → **Mitigation**: Store in .env, never commit
