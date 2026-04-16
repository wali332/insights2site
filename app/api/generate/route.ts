import { NextResponse } from 'next/server';
import { GenerateResponse, Insight, Website } from '../../../types';

export const POST = async (request: Request) => {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Heuristic text parsing algorithm
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Identify negative / pain keywords
    const painKeywords = ['mess', 'struggling', 'wish', 'overwhelmed', 'hard', 'slow', 'bad', 'issue', 'problem', 'difficult'];
    const desireKeywords = ['saved', 'easy', 'recommend', 'great', 'reduced', 'increased', 'love', 'perfect', 'lifesaver', 'automatically'];
    
    const insights: Insight[] = [];
    
    let combinedBenefits: string[] = [];
    let combinedTestimonials: string[] = [];
    let mainPain = "manual tasks and disorganized schedules";
    let mainDesire = "a streamlined, automated system";
    
    sentences.forEach((sentence, idx) => {
      const lowerSentence = sentence.toLowerCase();
      
      let isPain = painKeywords.some(kw => lowerSentence.includes(kw));
      let isDesire = desireKeywords.some(kw => lowerSentence.includes(kw));
      
      if (isPain) {
        insights.push({
          id: `insight-pain-${idx}`,
          type: "pain",
          text: sentence.trim(),
          usedIn: "hero"
        });
        mainPain = sentence.trim();
      }
      
      if (isDesire) {
        insights.push({
          id: `insight-desire-${idx}`,
          type: "desire",
          text: sentence.trim(),
          usedIn: "benefits"
        });
        combinedBenefits.push(sentence.trim());
      }
      
      // Keywords - extract specific length nouns heuristically (rough approximation)
      const words = sentence.split(/\s+/);
      const longWords = words.filter(w => w.length > 7);
      if (longWords.length > 0 && insights.length < 5) {
        insights.push({
          id: `insight-kw-${idx}`,
          type: "keyword",
          text: `Focuses on: ${longWords[0].replace(/[^a-zA-Z]/g, '')}`,
          usedIn: "cta"
        });
      }
      
      if (sentence.length > 20 && combinedTestimonials.length < 2) {
        combinedTestimonials.push(sentence.trim());
      }
    });

    // Make sure we have enough insights fallback natively
    if (insights.length === 0) {
      insights.push({
        id: "default-1",
        type: "pain",
        text: "Users are facing unspecified challenges.",
        usedIn: "hero"
      });
      insights.push({
        id: "default-2",
        type: "desire",
        text: "Users desire an easy solution.",
        usedIn: "benefits"
      });
    }

    // Add a default testimonial mapping to show interaction
    if (combinedTestimonials.length > 0) {
      insights.push({
        id: `insight-testi-main`,
        type: "desire",
        text: "Strong positive reception from users.",
        usedIn: "testimonials"
      });
    }

    // Construct website data based on text
    const website: Website = {
      headline: `Stop struggling with ${mainPain.substring(0, 30)}...`,
      subheadline: `Get ${mainDesire} today. Our platform transforms how you work with smart automation based on real feedback.`,
      benefits: combinedBenefits.length >= 3 ? combinedBenefits.slice(0, 3) : [
        "Saves you 10+ hours a week.",
        "Reduces human error significantly.",
        "Integrates with your existing workflow."
      ],
      testimonials: combinedTestimonials.length >= 2 ? combinedTestimonials.slice(0, 2) : [
        "This product is amazing. I can't imagine working without it anymore.",
        "It literally takes the pain out of my daily administrative tasks. Highly recommended!"
      ],
      cta: "Start Your Free Trial"
    };

    const response: GenerateResponse = {
      insights,
      website
    };

    // Simulate network delay for realistic loader UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
