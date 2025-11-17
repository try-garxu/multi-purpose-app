import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url, format } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);

    let chosenFormat;
    if (format === 'audio') {
      chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    } else {
      chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    }

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      duration: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      downloadUrl: chosenFormat.url,
      format: format
    });

  } catch (error) {
    console.error('YouTube download error:', error);
    return NextResponse.json(
      { error: 'Failed to process YouTube video. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}
