import type { Block } from "../blocks";

export const content: Block[] = [
  {
    type: "callout",
    variant: "insight",
    text: "90% classification accuracy. ~200 lines of TypeScript. Zero ML libraries. No model weights. No training infrastructure. Just math that's been proven for 270 years.",
  },
  {
    type: "paragraph",
    text: "ScrollOS is an email newsletter OS — it ingests Gmail and Outlook inboxes, organizes high-volume newsletters, and surfaces what actually matters. The core feature is intelligent classification: each newsletter is categorized (Tech, Finance, Fitness, Design, etc.) so users can switch between topics the way you switch between apps.",
  },
  {
    type: "paragraph",
    text: "When I started building this, every classification approach I could find pointed to one of three options: a pre-trained model (GPT or a fine-tuned BERT variant), a third-party classification API, or a rules-based keyword matcher. I didn't want any of them. The model was overkill and introduced latency I didn't want. The API added cost at a scale that didn't pencil out ($0.002/email × 1,000 emails/user × 10,000 users = $20,000/month). The keyword matcher had 60% accuracy in testing.",
  },
  {
    type: "paragraph",
    text: "So I built a Naive Bayes classifier from scratch. Here's every decision, every line of code, and the math behind why it works.",
  },
  {
    type: "h2",
    text: "Why Bayes Theorem Works for Text Classification",
  },
  {
    type: "paragraph",
    text: "The core idea: given the words in an email, what's the probability it belongs to each category? Bayes' theorem gives us exactly this:",
  },
  {
    type: "code",
    language: "text",
    code: `P(Category | Words) = P(Words | Category) × P(Category) / P(Words)

Since P(Words) is constant across all categories (we're comparing, not calculating absolute probabilities):
P(Category | Words) ∝ P(Words | Category) × P(Category)

The "Naive" assumption: words are conditionally independent given the category.
So: P(Words | Category) = P(word1 | Category) × P(word2 | Category) × ...

In log space (to avoid float underflow with many words):
log P(Category | Words) ∝ log P(Category) + Σ log P(wordᵢ | Category)`,
  },
  {
    type: "paragraph",
    text: "The 'naive' independence assumption is almost certainly wrong — words are not independent. 'Machine' and 'learning' are correlated. But it doesn't matter. The classifier doesn't need to be correct about the joint distribution; it just needs to pick the right category. And it does, with remarkable consistency, because even if the absolute probabilities are wrong, the relative ordering between categories is usually right.",
  },
  {
    type: "h2",
    text: "N-grams: Why Single Words Aren't Enough",
  },
  {
    type: "paragraph",
    text: "A unigram model treats each word independently. 'deep' and 'learning' each contribute their individual probabilities. A bigram model includes 'deep learning' as a single feature. Trigrams add 'machine learning model', etc.",
  },
  {
    type: "paragraph",
    text: "For newsletter classification, bigrams are significantly better than unigrams. 'Portfolio' alone is ambiguous — could be Design, Finance, or Tech. 'Portfolio management' is Finance. 'Portfolio site' is Design. 'Investment portfolio' is Finance. The bigram disambiguates what the single word cannot.",
  },
  {
    type: "code",
    language: "typescript",
    filename: "ngrams.ts",
    code: `/**
 * Extract n-grams from a token array.
 * Returns unigrams + bigrams by default (n=1 and n=2).
 */
export function extractNgrams(tokens: string[], maxN: number = 2): string[] {
  const ngrams: string[] = [];

  for (let n = 1; n <= maxN; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(" "));
    }
  }

  return ngrams;
}

/**
 * Tokenize email text: lowercase, strip HTML, remove stopwords,
 * remove numbers, collapse whitespace.
 */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
  "for", "of", "with", "by", "from", "is", "was", "are", "were",
  "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "this", "that",
  "these", "those", "i", "you", "he", "she", "we", "they", "it",
  "not", "no", "nor", "so", "yet", "both", "either", "neither",
  "as", "if", "when", "than", "because", "while", "although",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")           // strip HTML
    .replace(/https?:\/\/\S+/g, " ")    // strip URLs
    .replace(/[^a-z\s]/g, " ")          // keep only letters
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}`,
  },
  {
    type: "h2",
    text: "The Classifier Implementation",
  },
  {
    type: "paragraph",
    text: "The classifier needs to do two things: learn from labeled examples (fit), and predict the category of new examples (predict). I store everything in plain TypeScript Maps — no external state, no database queries during classification.",
  },
  {
    type: "code",
    language: "typescript",
    filename: "classifier.ts",
    code: `interface CategoryStats {
  docCount: number;
  ngramCounts: Map<string, number>;
  totalNgrams: number;
}

export class NaiveBayesClassifier {
  private categories = new Map<string, CategoryStats>();
  private totalDocs = 0;
  private vocabulary = new Set<string>();
  private alpha: number;  // Laplace smoothing parameter

  constructor(alpha = 1.0) {
    this.alpha = alpha;
  }

  /**
   * Add a training document.
   * Call this for each labeled email in the training set.
   */
  fit(text: string, category: string): void {
    const tokens = tokenize(text);
    const ngrams = extractNgrams(tokens, 2);

    if (!this.categories.has(category)) {
      this.categories.set(category, {
        docCount: 0,
        ngramCounts: new Map(),
        totalNgrams: 0,
      });
    }

    const stats = this.categories.get(category)!;
    stats.docCount++;
    this.totalDocs++;

    for (const ngram of ngrams) {
      this.vocabulary.add(ngram);
      stats.ngramCounts.set(ngram, (stats.ngramCounts.get(ngram) ?? 0) + 1);
      stats.totalNgrams++;
    }
  }

  /**
   * Classify a new document.
   * Returns the most likely category and confidence scores for all categories.
   */
  predict(text: string): { category: string; scores: Record<string, number> } {
    const tokens = tokenize(text);
    const ngrams = extractNgrams(tokens, 2);
    const vocabSize = this.vocabulary.size;

    let bestCategory = "";
    let bestScore = -Infinity;
    const scores: Record<string, number> = {};

    for (const [category, stats] of this.categories) {
      // Prior: log P(category)
      const logPrior = Math.log(stats.docCount / this.totalDocs);

      // Likelihood: Σ log P(ngram | category) with Laplace smoothing
      let logLikelihood = 0;
      for (const ngram of ngrams) {
        const count = stats.ngramCounts.get(ngram) ?? 0;
        // Laplace smoothing: add alpha to numerator, alpha * V to denominator
        const logP = Math.log(
          (count + this.alpha) / (stats.totalNgrams + this.alpha * vocabSize)
        );
        logLikelihood += logP;
      }

      const score = logPrior + logLikelihood;
      scores[category] = score;

      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    return { category: bestCategory, scores };
  }

  /**
   * Serialize the classifier to JSON for persistence.
   * Store in DB or Redis — no need to retrain on each startup.
   */
  serialize(): string {
    const data = {
      totalDocs: this.totalDocs,
      alpha: this.alpha,
      vocabulary: Array.from(this.vocabulary),
      categories: Object.fromEntries(
        Array.from(this.categories.entries()).map(([cat, stats]) => [
          cat,
          {
            docCount: stats.docCount,
            totalNgrams: stats.totalNgrams,
            ngramCounts: Object.fromEntries(stats.ngramCounts),
          },
        ])
      ),
    };
    return JSON.stringify(data);
  }

  static deserialize(json: string): NaiveBayesClassifier {
    const data = JSON.parse(json);
    const classifier = new NaiveBayesClassifier(data.alpha);
    classifier.totalDocs = data.totalDocs;
    classifier.vocabulary = new Set(data.vocabulary);

    for (const [cat, stats] of Object.entries(data.categories as Record<string, {
      docCount: number;
      totalNgrams: number;
      ngramCounts: Record<string, number>;
    }>)) {
      classifier.categories.set(cat, {
        docCount: stats.docCount,
        totalNgrams: stats.totalNgrams,
        ngramCounts: new Map(Object.entries(stats.ngramCounts)),
      });
    }

    return classifier;
  }
}`,
  },
  {
    type: "h2",
    text: "Laplace Smoothing: Why You Need It",
  },
  {
    type: "paragraph",
    text: "Without smoothing, any n-gram that appears in the test email but was never seen in training for a given category produces log(0) = -Infinity. That single unknown word kills the entire classification for that category, regardless of how much evidence points to it.",
  },
  {
    type: "paragraph",
    text: "Laplace smoothing (add-1 smoothing) adds a count of alpha to every n-gram in every category, as if we'd seen each n-gram alpha times. This prevents zero probabilities while barely affecting the probability estimates for high-frequency n-grams.",
  },
  {
    type: "callout",
    variant: "info",
    text: "Alpha = 1.0 works well for newsletters. If your classifier is overconfident on short texts, try alpha = 0.1. If it's underconfident on long texts with many rare words, try alpha = 2.0. We tested 0.1, 0.5, 1.0, 2.0 and 1.0 gave the best F1 score on our validation set.",
  },
  {
    type: "h2",
    text: "Training Data Strategy",
  },
  {
    type: "paragraph",
    text: "This is where most implementations fall apart: where do you get labeled training data? I used three sources:",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "Newsletter domain metadata: Substack, Morning Brew, TechCrunch, etc. have predictable categories. Build a domain→category map for the 200 most popular newsletter domains. This covers ~40% of newsletters with 100% accuracy (the domain IS the category).",
      "User-confirmed labels: When users move a newsletter into a category folder, that's a training signal. Each user action updates the classifier's training data for that user.",
      "Bootstrap seed data: 50 hand-labeled newsletters per category, covering the 8 categories (Tech, Finance, Design, Health, Productivity, News, Sports, Other). This gets you from nothing to working.",
    ],
  },
  {
    type: "paragraph",
    text: "The combination of domain heuristics, seed data, and user feedback creates a self-improving system. New users start with the global model; as they use the app, their personal classifier adapts to their specific newsletter mix.",
  },
  {
    type: "h2",
    text: "Per-User vs Global Classifier",
  },
  {
    type: "paragraph",
    text: "ScrollOS runs one global classifier trained on all users' data plus one per-user classifier that's fine-tuned on their specific inbox. The per-user classifier handles idiosyncratic newsletters ('Fintech CEO digest' is Tech for most users, Finance for a VC).",
  },
  {
    type: "code",
    language: "typescript",
    filename: "classify.ts",
    code: `/**
 * Two-stage classification:
 * 1. Check domain map (O(1), 100% accurate for known domains)
 * 2. Per-user classifier (personalized)
 * 3. Global classifier (fallback)
 */
export async function classifyNewsletter(
  email: Email,
  userId: string,
  db: Database,
): Promise<string> {
  // Stage 1: Domain heuristic
  const senderDomain = email.from.split("@")[1];
  const domainCategory = DOMAIN_CATEGORY_MAP.get(senderDomain);
  if (domainCategory) return domainCategory;

  // Stage 2: Per-user classifier
  const userModelJson = await db.getUserClassifierModel(userId);
  if (userModelJson) {
    const userClassifier = NaiveBayesClassifier.deserialize(userModelJson);
    const text = \`\${email.subject} \${email.preview} \${email.sender_name}\`;
    const result = userClassifier.predict(text);
    // Only trust user model if it's confident
    const topScore = Math.max(...Object.values(result.scores));
    const secondScore = Object.values(result.scores)
      .sort((a, b) => b - a)[1] ?? -Infinity;
    if (topScore - secondScore > 2.0) {
      return result.category;
    }
  }

  // Stage 3: Global classifier
  const globalClassifier = await getGlobalClassifier(db);
  const text = \`\${email.subject} \${email.preview} \${email.sender_name}\`;
  return globalClassifier.predict(text).category;
}`,
  },
  {
    type: "h2",
    text: "Performance in Production",
  },
  {
    type: "metrics",
    items: [
      { label: "Classification accuracy", value: "90%", description: "Across all categories" },
      { label: "Classification latency", value: "<2ms", description: "Per email, P99" },
      { label: "Memory per classifier", value: "~400KB", description: "Serialized JSON" },
      { label: "Training time", value: "<50ms", description: "On 1,000 labeled examples" },
    ],
  },
  {
    type: "paragraph",
    text: "The <2ms latency is the killer feature. A GPT-based classifier would take 200–800ms per email. With 1,000 emails per user inbox sync, that's the difference between a 2-second operation and a 15-minute background job. The Bayesian classifier runs synchronously during inbox sync with negligible impact.",
  },
  {
    type: "h2",
    text: "Where It Fails (and Why I'm OK With It)",
  },
  {
    type: "paragraph",
    text: "The classifier fails on newsletters that span multiple categories ('The Generalist' covers Tech + Finance + Business), newsletters that are contextually dependent (a newsletter about 'the Fed' is Finance, but 'Fed Up' is Politics), and very short emails with under 20 words (insufficient signal).",
  },
  {
    type: "paragraph",
    text: "For the 10% failure rate: the UI shows a confidence indicator. Low-confidence classifications get a 'Confirm?' prompt that turns into training data when the user corrects it. The 10% becomes a feature — it's how the model keeps improving.",
  },
  {
    type: "callout",
    variant: "insight",
    text: "Naive Bayes isn't the most accurate classifier in the world. It's the most accurate classifier you can build in a weekend, run in 2ms, deploy with no infrastructure, and explain to a non-ML engineer in 10 minutes. In production, those constraints matter more than academic benchmarks.",
  },
  {
    type: "h2",
    text: "The Full Picture: What ~200 Lines Buys You",
  },
  {
    type: "paragraph",
    text: "The core classifier — tokenizer, n-gram extractor, fit/predict, serializer — is 180 lines of TypeScript. Add the domain map, the two-stage classification logic, and the training update hook, and you're at about 280 lines total. That's it. No model files to ship, no GPU to provision, no third-party API to depend on, no cost that scales with usage.",
  },
  {
    type: "paragraph",
    text: "Sometimes the 270-year-old algorithm is the right one.",
  },
];
