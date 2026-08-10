<?php

namespace App\Jobs;

use App\Models\ItineraryJob;
use App\Services\AiItineraryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateItineraryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(
        private ItineraryJob $itineraryJob
    ) {}

    public function handle(AiItineraryService $itineraryService): void
    {
        $this->itineraryJob->update(['status' => 'processing']);

        try {
            $result = $itineraryService->generate($this->itineraryJob->request_data);

            $this->itineraryJob->update([
                'status' => 'completed',
                'result' => $result,
            ]);
        } catch (\Exception $e) {
            $this->itineraryJob->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
