import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Function to generate a simple animated video frame
function generateVideoFrame(
  text: string,
  frameNumber: number,
  totalFrames: number
): string {
  const width = 1080;
  const height = 1920;

  // Create SVG-based animation frame
  const progress = frameNumber / totalFrames;
  const opacity = Math.sin(progress * Math.PI); // Fade in and out

  // Word-by-word animation
  const words = text.split(' ');
  const wordsToShow = Math.floor(progress * words.length);
  const visibleText = words.slice(0, wordsToShow + 1).join(' ');

  // Dynamic gradient based on frame
  const hue = (frameNumber * 2) % 360;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${frameNumber}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(${hue}, 70%, 50%);stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(${(hue + 60) % 360}, 70%, 50%);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad${frameNumber})"/>
      <foreignObject x="0" y="0" width="${width}" height="${height}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px;
          box-sizing: border-box;
        ">
          <p style="
            color: white;
            font-size: 64px;
            font-weight: bold;
            text-align: center;
            line-height: 1.4;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.8);
            opacity: ${opacity};
            font-family: Arial, sans-serif;
          ">${visibleText}</p>
        </div>
      </foreignObject>

      <!-- Decorative elements -->
      <circle cx="${540 + Math.sin(progress * Math.PI * 4) * 200}"
              cy="${300}"
              r="100"
              fill="rgba(255,255,255,0.1)" />
      <circle cx="${540 - Math.sin(progress * Math.PI * 4) * 200}"
              cy="${1620}"
              r="100"
              fill="rgba(255,255,255,0.1)" />

      <!-- Progress indicator -->
      <rect x="0"
            y="${height - 20}"
            width="${width * progress}"
            height="20"
            fill="rgba(255,255,255,0.5)" />
    </svg>
  `;

  return svg;
}

// Generate a complete video from data
async function generateVideo(videoData: any): Promise<Buffer> {
  const { script, duration, frames } = videoData;

  // For a web-based demo, we'll create an MP4-compatible HTML5 video
  // In production, you'd use ffmpeg or a video encoding service

  // Create a simple animated SVG sequence
  const frameData = [];
  for (let i = 0; i < Math.min(frames, 90); i++) {
    // Limit to 90 frames for demo (3 seconds at 30fps)
    const frame = generateVideoFrame(script, i, 90);
    frameData.push(frame);
  }

  // Create a webm video using canvas animation technique
  // This is a simplified approach - in production use proper video encoding

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; background: #000; }
        canvas { display: block; }
      </style>
    </head>
    <body>
      <canvas id="canvas" width="1080" height="1920"></canvas>
      <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const script = ${JSON.stringify(script)};
        const duration = ${duration};
        let startTime = Date.now();

        function animate() {
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min(elapsed / duration, 1);

          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
          const hue = (elapsed * 60) % 360;
          gradient.addColorStop(0, \`hsl(\${hue}, 70%, 50%)\`);
          gradient.addColorStop(1, \`hsl(\${(hue + 60) % 360}, 70%, 50%)\`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1080, 1920);

          // Draw text with animation
          const words = script.split(' ');
          const wordsToShow = Math.floor(progress * words.length);
          const text = words.slice(0, wordsToShow + 1).join(' ');

          ctx.fillStyle = 'white';
          ctx.font = 'bold 64px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 4;
          ctx.shadowOffsetY = 4;

          // Word wrap
          const maxWidth = 920;
          const lines = [];
          let currentLine = '';

          text.split(' ').forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
              lines.push(currentLine);
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          });
          lines.push(currentLine);

          const lineHeight = 90;
          const startY = 960 - (lines.length * lineHeight) / 2;

          lines.forEach((line, i) => {
            ctx.fillText(line, 540, startY + i * lineHeight);
          });

          // Decorative circles
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(540 + Math.sin(progress * Math.PI * 4) * 200, 300, 100, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(540 - Math.sin(progress * Math.PI * 4) * 200, 1620, 100, 0, Math.PI * 2);
          ctx.fill();

          // Progress bar
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillRect(0, 1900, 1080 * progress, 20);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        animate();
      </script>
    </body>
    </html>
  `;

  // Return HTML as a buffer (in production, this would be an actual video file)
  return Buffer.from(html, 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataParam = searchParams.get('data');

    if (!dataParam) {
      return NextResponse.json(
        { error: 'Video data parameter is required' },
        { status: 400 }
      );
    }

    const videoData = JSON.parse(decodeURIComponent(dataParam));

    // Generate video
    const videoBuffer = await generateVideo(videoData);

    // Return as HTML page that renders video animation
    // In production, this would be an actual MP4/WebM video file
    return new NextResponse(videoBuffer.toString('utf-8'), {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
