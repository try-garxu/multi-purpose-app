import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const format = searchParams.get('format') || 'video';

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');

    let filename;
    let videoStream;

    if (format === 'audio') {
      filename = `${title}.mp3`;
      videoStream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
    } else {
      filename = `${title}.mp4`;
      videoStream = ytdl(url, { quality: 'highest' });
    }

    // Convert Node.js stream to Web Stream
    const stream = new ReadableStream({
      start(controller) {
        videoStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        videoStream.on('end', () => {
          controller.close();
        });
        videoStream.on('error', (error) => {
          controller.error(error);
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': format === 'audio' ? 'audio/mpeg' : 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
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
