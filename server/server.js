const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    try {
        
        const youtubeResults = await searchYouTubeVideos(query);
        const articleResults = await searchArticles(query);
        
        
        res.json({
            youtube: youtubeResults,
            articles: articleResults, 
            papers: [],   
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching data');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// YouTube search function
async function searchYouTubeVideos(query) {
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
    const apiKey = process.env.API_KEY; 

    const response = await axios.get(YOUTUBE_API_URL, {
        params: {
            part: 'snippet',
            maxResults: 5, 
            q: query,
            key: apiKey
        }
    });

    const videoData = response.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    return videoData;
}

//searching articles
async function searchArticles(query) {
    const GOOGLE_SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';
    const apiKey = process.env.API_KEY;
    const cx = process.env.CX;  

    const response = await axios.get(GOOGLE_SEARCH_API_URL, {
        params: {
            q: query,
            key: apiKey,
            cx: cx
        }
    });

    const articleData = response.data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet
    }));

    return articleData;
}
