import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { Readable } from 'stream';

// Helper to convert Node.js Readable to Web ReadableStream
function nodeStreamToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on('end', () => {
        controller.close();
      });
      nodeStream.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

export async function GET(request: NextRequest) {
  console.log('YouTube stream request received');

  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const format = searchParams.get('format') || 'video';

    console.log('URL:', url, 'Format:', format);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    console.log('Getting video info...');
    const info = await ytdl.getInfo(url);
    console.log('Video info received:', info.videoDetails.title);

    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');

    let filename: string;
    let contentType: string;

    if (format === 'audio') {
      filename = `${title}.mp3`;
      contentType = 'audio/mpeg';
    } else {
      filename = `${title}.mp4`;
      contentType = 'video/mp4';
    }

    console.log('Creating stream for:', filename);

    // Create the ytdl stream
    const videoStream = ytdl(url,
      format === 'audio'
        ? { quality: 'highestaudio', filter: 'audioonly' }
        : { quality: 'highest' }
    );

    // Add error handler to the ytdl stream
    videoStream.on('error', (err) => {
      console.error('ytdl stream error:', err);
    });

    videoStream.on('info', (info, format) => {
      console.log('Stream started, format:', format.qualityLabel || format.audioBitrate);
    });

    // Convert to Web ReadableStream
    const webStream = nodeStreamToWebStream(videoStream);

    console.log('Returning stream response');

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('YouTube stream error:', error);
    return NextResponse.json(
      { error: 'Failed to stream YouTube video. Please try again.' },
      { status: 500 }
    );
  }
}
