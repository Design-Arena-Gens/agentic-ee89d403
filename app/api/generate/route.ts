import { NextRequest, NextResponse } from 'next/server';

// Viral script templates for different topics
const VIRAL_TEMPLATES = {
  motivational: [
    "The only way to do great work is to love what you do. Your passion fuels your purpose. Wake up every day and chase your dreams relentlessly. Success isn't given, it's earned through dedication and persistence.",
    "Stop waiting for the perfect moment. The perfect moment is NOW. Every second you hesitate is a second lost. Take action today and watch your life transform before your eyes.",
    "Your mindset determines your success. Winners think differently. They see obstacles as opportunities. They turn setbacks into comebacks. Are you ready to adopt a winning mindset?",
  ],
  facts: [
    "Did you know? Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that's still perfectly edible. Nature's eternal sweetness preserved through millennia!",
    "Your brain uses 20% of your body's energy but only makes up 2% of your body weight. It's the most powerful computer ever created, capable of processing 70,000 thoughts per day!",
    "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps it to the rest of the body. They're truly alien-like creatures of the deep!",
  ],
  lifehacks: [
    "Want to remember names better? Repeat the person's name three times in conversation. This simple trick activates your memory and makes you more likable. Try it today!",
    "Boost your productivity instantly: Use the 2-minute rule. If a task takes less than 2 minutes, do it immediately. Stop procrastinating and start accomplishing!",
    "Can't sleep? Try the 4-7-8 breathing technique. Breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 4 times. Your body will naturally relax into sleep mode.",
  ],
  funny: [
    "Why do programmers prefer dark mode? Because light attracts bugs! And trust me, nobody wants more bugs in their code. It's not just a preference, it's pest control!",
    "Fun fact: The voices in my head may not be real, but they have some great ideas! Sometimes the best conversations are the ones you have with yourself. At least you always win the argument!",
    "I told my computer I needed a break, and now it won't stop sending me Kit Kat ads. Apparently, artificial intelligence has a sense of humor. And a marketing degree!",
  ],
  default: [
    "Success is not final, failure is not fatal. It's the courage to continue that counts. Every day is a new opportunity to be better than yesterday. Make it count!",
    "The future belongs to those who believe in the beauty of their dreams. Don't let anyone dim your light. Shine bright and inspire others to do the same!",
    "In a world where you can be anything, be kind. Your words and actions have power. Use them to lift others up and create positive change in the world.",
  ],
};

// Function to find viral script based on topic
function findViralScript(topic: string): string {
  const lowerTopic = topic.toLowerCase();

  if (lowerTopic.includes('motivat') || lowerTopic.includes('inspir')) {
    const scripts = VIRAL_TEMPLATES.motivational;
    return scripts[Math.floor(Math.random() * scripts.length)];
  } else if (lowerTopic.includes('fact') || lowerTopic.includes('science') || lowerTopic.includes('trivia')) {
    const scripts = VIRAL_TEMPLATES.facts;
    return scripts[Math.floor(Math.random() * scripts.length)];
  } else if (lowerTopic.includes('hack') || lowerTopic.includes('tip') || lowerTopic.includes('trick')) {
    const scripts = VIRAL_TEMPLATES.lifehacks;
    return scripts[Math.floor(Math.random() * scripts.length)];
  } else if (lowerTopic.includes('funny') || lowerTopic.includes('humor') || lowerTopic.includes('joke')) {
    const scripts = VIRAL_TEMPLATES.funny;
    return scripts[Math.floor(Math.random() * scripts.length)];
  } else {
    const scripts = VIRAL_TEMPLATES.default;
    return scripts[Math.floor(Math.random() * scripts.length)];
  }
}

// Function to generate audio URL from text (using browser's built-in TTS simulation)
function generateAudioData(text: string): string {
  // Calculate approximate duration based on text length (average reading speed)
  const wordsPerMinute = 150;
  const words = text.split(' ').length;
  const duration = Math.ceil((words / wordsPerMinute) * 60);

  return JSON.stringify({
    text,
    duration,
    voice: 'AI_Voice_1',
  });
}

// Function to create video preview data
function createVideoPreview(script: string, audioData: string): any {
  const parsedAudio = JSON.parse(audioData);

  // Create a data URL for the video preview (encoded animation data)
  const videoData = {
    script,
    duration: parsedAudio.duration,
    frames: Math.ceil(parsedAudio.duration * 30), // 30 FPS
    resolution: { width: 1080, height: 1920 }, // 9:16 format
    voiceover: true,
  };

  // In a real implementation, this would be an actual video file
  // For demo purposes, we'll use a placeholder
  return {
    videoUrl: `/api/video?data=${encodeURIComponent(JSON.stringify(videoData))}`,
    duration: parsedAudio.duration,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    // Step 1: Find viral script
    const script = findViralScript(topic);

    // Step 2: Generate voice data
    const audioData = generateAudioData(script);

    // Step 3: Create video
    const videoPreview = createVideoPreview(script, audioData);

    // Return the complete result
    return NextResponse.json({
      script,
      videoUrl: videoPreview.videoUrl,
      duration: videoPreview.duration,
      topic,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
