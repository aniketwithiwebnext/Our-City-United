import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_LISTINGS, INITIAL_REVIEWS, INITIAL_EVENTS, INITIAL_BLOG_POSTS } from './src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client safely on server side
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data state seeded with initial mock data
  let listings = [...INITIAL_LISTINGS];
  let reviews = [...INITIAL_REVIEWS];
  let events = [...INITIAL_EVENTS];
  let blogPosts = [...INITIAL_BLOG_POSTS];
  let inquiries: any[] = [
    {
      id: 'inq-1',
      businessId: 'socorro-mission-bakery',
      businessName: 'Socorro Historic Mission Bakery',
      senderName: 'John Doe',
      senderEmail: 'johndoe@example.com',
      senderPhone: '(915) 555-0192',
      message: 'Hi! Do you take custom birthday cake orders 2 weeks in advance?',
      createdAt: '2026-07-20T10:30:00Z',
      read: false,
    },
  ];

  let analyticsCounter = {
    totalViews: 4520,
    searchQueries: 1890,
    leadsGenerated: 342,
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', company: 'Our City United LLC', location: 'Socorro, TX' });
  });

  // GET all listings
  app.get('/api/listings', (req, res) => {
    const { category, search, city, zip, openNow, rating, sort } = req.query;
    let filtered = [...listings];

    if (category && category !== 'All') {
      filtered = filtered.filter(
        (b) =>
          b.category.toLowerCase() === (category as string).toLowerCase() ||
          b.subcategories.some((s) => s.toLowerCase() === (category as string).toLowerCase())
      );
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tagline.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.services.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (city) {
      filtered = filtered.filter((b) => b.city.toLowerCase() === (city as string).toLowerCase());
    }

    if (zip) {
      filtered = filtered.filter((b) => b.zipCode.includes(zip as string));
    }

    if (openNow === 'true') {
      filtered = filtered.filter((b) => b.isOpenNow);
    }

    if (rating) {
      const r = parseFloat(rating as string);
      filtered = filtered.filter((b) => b.rating >= r);
    }

    if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'reviews') {
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    res.json(filtered);
  });

  // GET single listing
  app.get('/api/listings/:id', (req, res) => {
    const listing = listings.find((b) => b.id === req.params.id || b.slug === req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  });

  // POST create listing
  app.post('/api/listings', (req, res) => {
    const newListing = {
      ...req.body,
      id: req.body.id || `bizz-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      verified: false,
      claimed: true,
      isOpenNow: true,
      lat: req.body.lat || 31.658,
      lng: req.body.lng || -106.29,
    };
    listings.unshift(newListing);
    res.status(201).json(newListing);
  });

  // PUT update listing
  app.put('/api/listings/:id', (req, res) => {
    const idx = listings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    listings[idx] = { ...listings[idx], ...req.body };
    res.json(listings[idx]);
  });

  // GET reviews for listing
  app.get('/api/reviews/:businessId', (req, res) => {
    const bReviews = reviews.filter((r) => r.businessId === req.params.businessId);
    res.json(bReviews);
  });

  // POST new review
  app.post('/api/reviews', (req, res) => {
    const { businessId, userName, rating, comment } = req.body;
    if (!businessId || !userName || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      businessId,
      userName,
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      comment,
    };
    reviews.unshift(newRev);

    // Recalculate rating
    const bReviews = reviews.filter((r) => r.businessId === businessId);
    const avg = bReviews.reduce((acc, curr) => acc + curr.rating, 0) / bReviews.length;
    const bIdx = listings.findIndex((b) => b.id === businessId);
    if (bIdx !== -1) {
      listings[bIdx].rating = Number(avg.toFixed(1));
      listings[bIdx].reviewCount = bReviews.length;
    }

    res.status(201).json(newRev);
  });

  // POST owner reply to review
  app.post('/api/reviews/:id/reply', (req, res) => {
    const revIdx = reviews.findIndex((r) => r.id === req.params.id);
    if (revIdx === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    reviews[revIdx].ownerReply = {
      date: new Date().toISOString().split('T')[0],
      comment: req.body.comment,
    };
    res.json(reviews[revIdx]);
  });

  // POST customer inquiry
  app.post('/api/inquiries', (req, res) => {
    const { businessId, businessName, senderName, senderEmail, senderPhone, message } = req.body;
    const newInq = {
      id: `inq-${Date.now()}`,
      businessId,
      businessName,
      senderName,
      senderEmail,
      senderPhone: senderPhone || '',
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    inquiries.unshift(newInq);
    analyticsCounter.leadsGenerated += 1;
    res.status(201).json({ success: true, inquiry: newInq });
  });

  // GET inquiries
  app.get('/api/inquiries', (req, res) => {
    res.json(inquiries);
  });

  // GET events
  app.get('/api/events', (req, res) => {
    res.json(events);
  });

  // GET blog posts
  app.get('/api/blog', (req, res) => {
    res.json(blogPosts);
  });

  // GET analytics
  app.get('/api/analytics', (req, res) => {
    analyticsCounter.totalViews += 1;
    res.json({
      ...analyticsCounter,
      totalListings: listings.length,
      totalReviews: reviews.length,
      monthlySearches: analyticsCounter.searchQueries,
      monthlyLeads: analyticsCounter.leadsGenerated,
      revenueThisMonth: 1280,
      topCategories: [
        { name: 'Restaurants', views: 1420 },
        { name: 'Automotive', views: 890 },
        { name: 'Home Services', views: 760 },
        { name: 'Medical', views: 650 },
        { name: 'Pets', views: 420 },
      ],
    });
  });

  // --- GEMINI AI API ENDPOINTS ---

  // 1. AI Assistant Chatbot
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient();

      const availableBusinessesContext = listings
        .map(
          (b) =>
            `- ${b.name} (${b.category}): ${b.tagline}. Address: ${b.address}, Socorro TX. Phone: ${b.phone}. Services: ${b.services.join(', ')}.`
        )
        .join('\n');

      const systemInstruction = `You are "Our City AI", the friendly, knowledgeable digital assistant for Our City United LLC in Socorro, Texas.
Company details:
- Business Name: Our City United LLC
- City: Socorro, Texas
- Phone: (915) 300-3190
- Email: Ourcityunited@gmail.com

Your job is to assist local residents, visitors, and business owners in finding local Socorro businesses, upcoming events, and business listing tips.
Here are current active listings in our directory:
${availableBusinessesContext}

Keep responses concise, warm, helpful, and community-oriented. If someone asks for recommendations, point them to specific Socorro businesses from our list or offer local guidance. Always mention phone or location details when helpful.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'I am here to help you explore businesses and services in Socorro, Texas!';
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      res.json({
        reply:
          'Welcome to Our City United LLC! I can help you find local Socorro restaurants, automotive care, medical centers, contractors, or answer questions about listing your business with us at (915) 300-3190.',
      });
    }
  });

  // 2. AI Smart Business Search & Natural Language Recommendations
  app.post('/api/gemini/search', async (req, res) => {
    try {
      const { query } = req.body;
      analyticsCounter.searchQueries += 1;

      if (!query || query.trim().length === 0) {
        return res.json({ matches: listings, aiExplanation: 'Showing all active Socorro businesses.' });
      }

      const ai = getGeminiClient();

      const prompt = `Given the user query: "${query}", analyze the following directory listings in Socorro, Texas and select the top matching business IDs. Also provide a friendly 2-sentence explanation of why these businesses match the request.

Directory Listings:
${JSON.stringify(
  listings.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    subcategories: l.subcategories,
    description: l.description,
    services: l.services,
  }))
)}

Respond ONLY in valid JSON with this schema:
{
  "matchedIds": ["id1", "id2"],
  "aiExplanation": "explanation string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const json = JSON.parse(response.text || '{}');
      const matchedListings = listings.filter((l) => json.matchedIds?.includes(l.id));

      res.json({
        matches: matchedListings.length > 0 ? matchedListings : listings,
        aiExplanation: json.aiExplanation || `Found matches for "${query}" in Socorro, TX.`,
      });
    } catch (error) {
      console.error('Gemini Search Error:', error);
      res.json({
        matches: listings,
        aiExplanation: `Searching businesses in Socorro, Texas for "${req.body.query}".`,
      });
    }
  });

  // 3. AI Business Summary Generator
  app.post('/api/gemini/summary', async (req, res) => {
    try {
      const { name, category, description, services } = req.body;
      const ai = getGeminiClient();

      const prompt = `Write a compelling 1-2 sentence executive summary for a business listing in Socorro, Texas.
Business Name: ${name}
Category: ${category}
Services: ${services?.join(', ')}
Description: ${description}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ summary: response.text?.trim() });
    } catch (error) {
      res.json({ summary: `${req.body.name} is a trusted local provider in Socorro, Texas offering quality ${req.body.category} services.` });
    }
  });

  // Vite development server integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
