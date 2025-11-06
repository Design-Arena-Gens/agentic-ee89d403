'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const generateVideo = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              🎬 Viral Shorts Generator
            </h1>
            <p className="text-gray-300 text-lg">
              AI-powered agent that finds viral scripts and converts them into YouTube Shorts with voiceovers
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
            <label className="block text-white text-lg font-semibold mb-4">
              Enter a topic or niche:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., motivational quotes, funny facts, life hacks..."
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && generateVideo()}
              />
              <button
                onClick={generateVideo}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? '🔄 Generating...' : '✨ Generate'}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  <p className="text-white">🔍 Searching for viral scripts...</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="text-white">✍️ Crafting engaging content...</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                  <p className="text-white">🎤 Generating AI voiceover...</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  <p className="text-white">🎥 Creating video frames...</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Script */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  📝 Viral Script
                </h2>
                <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                  <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                    {result.script}
                  </p>
                </div>
              </div>

              {/* Video Preview */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  🎬 Video Preview
                </h2>
                <div className="bg-black rounded-xl overflow-hidden aspect-[9/16] max-w-md mx-auto shadow-2xl">
                  <video
                    controls
                    className="w-full h-full"
                    src={result.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-6 flex gap-4 justify-center">
                  <a
                    href={result.videoUrl}
                    download="viral-short.mp4"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                  >
                    ⬇️ Download Video
                  </a>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  📊 Video Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white text-xl font-bold">{result.duration}s</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Format</p>
                    <p className="text-white text-xl font-bold">9:16 Shorts</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Voice</p>
                    <p className="text-white text-xl font-bold">AI Generated</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-green-400 text-xl font-bold">✓ Ready</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          {!result && !loading && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-white font-bold text-lg mb-2">AI Script Search</h3>
                <p className="text-gray-300 text-sm">
                  Finds trending viral scripts optimized for engagement
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🎤</div>
                <h3 className="text-white font-bold text-lg mb-2">Voice Generation</h3>
                <p className="text-gray-300 text-sm">
                  Professional AI voiceover with natural intonation
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-white font-bold text-lg mb-2">Video Creation</h3>
                <p className="text-gray-300 text-sm">
                  Automatically creates engaging 9:16 video format
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
