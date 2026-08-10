import apiClient from './apiClient';

export async function generateItinerary(data) {
    const response = await apiClient.post('/ai/itinerary', data, {
        timeout: 60000,
    });
    return response.data;
}

export async function getItineraryJobStatus(jobId) {
    const response = await apiClient.get(`/ai/itinerary/${jobId}/status`);
    return response.data;
}
