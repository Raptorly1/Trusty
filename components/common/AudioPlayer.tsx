
import React from 'react';
import { Play, Pause, AlertCircle, RotateCw } from 'lucide-react';

interface AudioPlayerProps {
    isPlaying: boolean;
    isGenerating: boolean;
    error: string | null;
    play: () => void;
    pause: () => void;
    generate: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, isGenerating, error, play, pause, generate }) => {
    
    const handleClick = () => {
        if (isGenerating) return;
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle className="h-6 w-6" />
                <span>{error}</span>
                <button onClick={generate} className="btn btn-sm btn-ghost">Try Again</button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4 p-4 bg-base-200 rounded-box">
             <button onClick={handleClick} className="btn btn-primary btn-circle" disabled={isGenerating}>
                {isGenerating ? <span className="loading loading-spinner"></span> : (isPlaying ? <Pause /> : <Play />)}
            </button>
            <div className="flex flex-col">
                <p className="font-bold text-lg">Audio Summary</p>
                <p className="text-sm text-base-content/70">
                    {isGenerating ? 'Generating summary...' : (isPlaying ? 'Playing...' : 'Listen to a summary of the analysis.')}
                </p>
            </div>
        </div>
    )
}

export default AudioPlayer;
