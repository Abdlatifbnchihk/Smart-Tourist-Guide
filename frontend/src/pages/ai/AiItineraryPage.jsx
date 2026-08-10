import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { generateItinerary, getItineraryJobStatus } from '../../services/aiService';
import { getCities } from '../../services/cityService';

export default function AiItineraryPage() {
    const [cityId, setCityId] = useState('');
    const [preference, setPreference] = useState('ADVENTURE');
    const [days, setDays] = useState(3);
    const [budget, setBudget] = useState('MEDIUM');
    const [formError, setFormError] = useState('');
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState(null);
    const pollingRef = useRef(null);

    const { data: cities, isLoading: citiesLoading } = useQuery({
        queryKey: ['cities'],
        queryFn: getCities,
        staleTime: 24 * 60 * 60 * 1000,
    });

    useEffect(() => {
        if (!jobId) return;

        const pollStatus = async () => {
            try {
                const status = await getItineraryJobStatus(jobId);
                setJobStatus(status.status);

                if (status.status === 'completed') {
                    setItinerary(status.result);
                    clearInterval(pollingRef.current);
                    pollingRef.current = null;
                } else if (status.status === 'failed') {
                    setError(status.error || 'Failed to generate itinerary');
                    clearInterval(pollingRef.current);
                    pollingRef.current = null;
                }
            } catch (err) {
                setError(err.message || 'Failed to check job status');
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };

        pollingRef.current = setInterval(pollStatus, 2000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setError(null);
        setItinerary(null);

        if (!cityId) {
            setFormError('Please select a city');
            return;
        }

        try {
            const response = await generateItinerary({
                city_id: parseInt(cityId),
                preferences: preference.toLowerCase(),
                number_of_days: parseInt(days),
                budget,
            });

            setJobId(response.job_id);
            setJobStatus('pending');
        } catch (err) {
            setError(err.message || 'Failed to start itinerary generation');
        }
    };

    const handleReset = () => {
        setJobId(null);
        setJobStatus(null);
        setItinerary(null);
        setError(null);
    };

    const isProcessing = jobId && jobStatus !== 'completed' && jobStatus !== 'failed';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 py-18 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Itinerary Generator</h1>
                <p className="text-gray-600 mb-8">Create a personalized travel plan for your trip</p>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <select
                                value={cityId}
                                onChange={(e) => setCityId(e.target.value)}
                                disabled={isProcessing}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            >
                                <option value="">{citiesLoading ? 'Loading cities...' : 'Select a city'}</option>
                                {cities?.map((city) => (
                                    <option key={city.city_id} value={city.city_id}>{city.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                            <input
                                type="number"
                                min="1"
                                max="14"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                disabled={isProcessing}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preference</label>
                            <div className="flex gap-4">
                                {['ADVENTURE', 'CULTURAL', 'RELAXATION'].map((p) => (
                                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="preference"
                                            value={p}
                                            checked={preference === p}
                                            onChange={(e) => setPreference(e.target.value)}
                                            disabled={isProcessing}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                            <div className="flex gap-4">
                                {['LOW', 'MEDIUM', 'HIGH'].map((b) => (
                                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="budget"
                                            value={b}
                                            checked={budget === b}
                                            onChange={(e) => setBudget(e.target.value)}
                                            disabled={isProcessing}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">{b}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Generating...' : 'Generate Itinerary'}
                    </button>
                </form>

                {isProcessing && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {jobStatus === 'pending' ? 'Queued for processing...' : 'Generating your itinerary...'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">This may take a minute or two</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={handleReset} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                            Try Again
                        </button>
                    </div>
                )}

                {itinerary && !isProcessing && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">{itinerary.city}</span> · {itinerary.total_days} days · {itinerary.budget}
                                </div>
                                <button onClick={handleReset} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    New Trip
                                </button>
                            </div>
                        </div>

                        {itinerary.itinerary?.map((day) => (
                            <div key={day.day} className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-indigo-600">D{day.day}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{day.theme}</h3>
                                </div>
                                <div className="space-y-3 ml-5 border-l-2 border-indigo-100 pl-6">
                                    {day.activities?.map((activity, idx) => (
                                        <div key={idx} className="relative p-4 bg-gray-50 rounded-lg">
                                            <div className="absolute -left-8 top-4 w-3 h-3 bg-indigo-400 rounded-full border-2 border-white"></div>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{activity.time}</span>
                                                        <span className="text-xs text-gray-500">{activity.duration}</span>
                                                    </div>
                                                    <p className="font-medium text-gray-900">{activity.attraction}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                                    {activity.tips && (
                                                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                                                            </svg>
                                                            {activity.tips}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-semibold text-green-600">{activity.estimated_cost}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Estimated Total Cost</span>
                            <span className="text-xl font-bold text-indigo-600">{itinerary.estimated_total_cost}</span>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
