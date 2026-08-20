export type ContentMetric = {
  score: number;
  label: string;
  feedback: string;
};

export type AnalysisResult = {
  score: number;
  metrics: {
    hook: ContentMetric;
    clarity: ContentMetric;
    readability: ContentMetric;
    engagement: ContentMetric;
    cta: ContentMetric;
  };
  strengths: string[];
  improvements: string[];
  stats: {
    wordCount: number;
    sentenceCount: number;
    averageSentenceLength: number;
  };
};

const clamp = (value: number): number => {
  return Math.min(100, Math.max(0, Math.round(value)));
};

const countMatches = (
  text: string,
  patterns: RegExp[],
): number => {
  return patterns.reduce(
    (count, pattern) =>
      count + (pattern.test(text) ? 1 : 0),
    0,
  );
};

const getSentences = (text: string): string[] => {
  return text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

const getWords = (text: string): string[] => {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

const calculateHookScore = (
  text: string,
): ContentMetric => {
  const sentences = getSentences(text);
  const firstSentence = sentences[0] ?? "";
  const normalized = firstSentence.toLowerCase();

  let score = 50;

  if (/[?]/.test(firstSentence)) {
    score += 15;
  }

  if (
    /^\s*(how|why|what|when|where|who|want|need|learn|discover|stop|start|try)\b/i.test(
      firstSentence,
    )
  ) {
    score += 15;
  }

  if (/\b\d+\b/.test(firstSentence)) {
    score += 10;
  }

  if (
    /\b(secret|mistake|problem|truth|guide|tips|ways|important|simple|best|worst|never|always)\b/i.test(
      normalized,
    )
  ) {
    score += 10;
  }

  if (
    /^(hi|hello|welcome|today i|in this post|in this video)\b/i.test(
      normalized,
    )
  ) {
    score -= 15;
  }

  score = clamp(score);

  return {
    score,
    label:
      score >= 80
        ? "Strong"
        : score >= 60
          ? "Moderate"
          : "Needs work",
    feedback:
      score >= 80
        ? "The opening contains strong attention signals."
        : score >= 60
          ? "The opening has some attention signals but could be sharper."
          : "Consider opening with a question, benefit, number, or stronger statement.",
  };
};

const calculateClarityScore = (
  text: string,
): ContentMetric => {
  const sentences = getSentences(text);
  const words = getWords(text);

  if (!words.length) {
    return {
      score: 0,
      label: "No content",
      feedback:
        "There is not enough text to evaluate clarity.",
    };
  }

  const averageSentenceLength =
    sentences.length > 0
      ? words.length / sentences.length
      : words.length;

  let score = 85;

  if (averageSentenceLength > 30) {
    score -= 20;
  } else if (averageSentenceLength > 22) {
    score -= 10;
  } else if (averageSentenceLength <= 15) {
    score += 5;
  }

  const vagueWords = (
    text.match(
      /\b(thing|stuff|something|various|etc|somehow|basically|really)\b/gi,
    ) ?? []
  ).length;

  score -= Math.min(vagueWords * 3, 15);

  return {
    score: clamp(score),
    label:
      score >= 80
        ? "Clear"
        : score >= 60
          ? "Mostly clear"
          : "Needs work",
    feedback:
      score >= 80
        ? "The content is relatively direct and easy to follow."
        : "Shorter sentences and more specific wording could improve clarity.",
  };
};

const calculateReadabilityScore = (
  text: string,
): ContentMetric => {
  const sentences = getSentences(text);
  const words = getWords(text);

  if (!words.length) {
    return {
      score: 0,
      label: "No content",
      feedback:
        "There is not enough text to evaluate readability.",
    };
  }

  const averageSentenceLength =
    sentences.length > 0
      ? words.length / sentences.length
      : words.length;

  let score = 90;

  if (averageSentenceLength > 25) {
    score -= 20;
  } else if (averageSentenceLength > 20) {
    score -= 10;
  }

  const longWords = words.filter(
    (word) =>
      word.replace(/[^a-zA-Z]/g, "").length >= 12,
  ).length;

  const longWordRatio = longWords / words.length;

  if (longWordRatio > 0.2) {
    score -= 15;
  } else if (longWordRatio > 0.1) {
    score -= 7;
  }

  return {
    score: clamp(score),
    label:
      score >= 80
        ? "Easy to read"
        : score >= 60
          ? "Readable"
          : "Dense",
    feedback:
      score >= 80
        ? "The text has a relatively accessible structure."
        : "Consider shorter sentences and simpler wording where possible.",
  };
};

const calculateEngagementScore = (
  text: string,
): ContentMetric => {
  let score = 50;

  const engagementPatterns = [
    /\?/,
    /\b(comment|reply|tell me|let me know)\b/i,
    /\b(save|bookmark)\b/i,
    /\b(share|send this)\b/i,
    /\b(follow|subscribe)\b/i,
    /\b(agree|disagree|thoughts|opinion)\b/i,
    /\b(you|your)\b/i,
  ];

  const matches = countMatches(
    text,
    engagementPatterns,
  );

  score += matches * 7;

  return {
    score: clamp(score),
    label:
      score >= 80
        ? "Strong"
        : score >= 60
          ? "Moderate"
          : "Low",
    feedback:
      score >= 80
        ? "The content contains several interaction-oriented signals."
        : score >= 60
          ? "There are some engagement signals, but more interaction cues could help."
          : "Consider adding a question, opinion prompt, or interaction cue.",
  };
};

const calculateCTAScore = (
  text: string,
): ContentMetric => {
  const ctaPatterns = [
    /\b(save|bookmark)\b/i,
    /\b(share|send)\b/i,
    /\b(comment|reply)\b/i,
    /\b(follow|subscribe)\b/i,
    /\b(learn more|read more|click|visit)\b/i,
    /\b(try|start|download|sign up|join)\b/i,
  ];

  const matches = countMatches(text, ctaPatterns);

  const score = clamp(40 + matches * 12);

  return {
    score,
    label:
      score >= 80
        ? "Strong"
        : score >= 60
          ? "Present"
          : "Weak",
    feedback:
      score >= 80
        ? "The content includes a clear action for the audience."
        : score >= 60
          ? "A call to action is present but could be more direct."
          : "Consider ending with a specific action for the audience.",
  };
};

export function analyzeContent(
  text: string,
): AnalysisResult {
  const words = getWords(text);
  const sentences = getSentences(text);

  const averageSentenceLength =
    sentences.length > 0
      ? Number(
          (words.length / sentences.length).toFixed(1),
        )
      : 0;

  const hook = calculateHookScore(text);
  const clarity = calculateClarityScore(text);
  const readability = calculateReadabilityScore(text);
  const engagement = calculateEngagementScore(text);
  const cta = calculateCTAScore(text);

  const metrics = {
    hook,
    clarity,
    readability,
    engagement,
    cta,
  };

  const score = clamp(
    hook.score * 0.25 +
      clarity.score * 0.2 +
      readability.score * 0.2 +
      engagement.score * 0.2 +
      cta.score * 0.15,
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hook.score >= 80) {
    strengths.push(
      "Your opening creates immediate interest with a strong attention signal.",
    );
  } else if (hook.score < 65) {
    improvements.push(
      "Strengthen the opening with a question, specific benefit, number, or unexpected statement.",
    );
  }

  if (clarity.score >= 80) {
    strengths.push(
      "Your message is direct and relatively easy to understand.",
    );
  } else if (clarity.score < 65) {
    improvements.push(
      "Make the message more specific and break complex ideas into shorter statements.",
    );
  }

  if (readability.score >= 80) {
    strengths.push(
      "The sentence structure makes the content easy to scan and read.",
    );
  } else if (readability.score < 65) {
    improvements.push(
      "Shorten dense sentences and simplify complex wording to improve readability.",
    );
  }

  if (engagement.score >= 80) {
    strengths.push(
      "The content gives the audience several opportunities to interact.",
    );
  } else if (engagement.score < 65) {
    improvements.push(
      "Create an interaction point by asking a question or inviting the audience to share an opinion.",
    );
  }

  if (cta.score >= 80) {
    strengths.push(
      "The content includes a clear action for the audience.",
    );
  } else if (cta.score < 65) {
    improvements.push(
      "Add a specific call to action such as saving, sharing, commenting, following, or trying something.",
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "The content has a solid foundation that can be improved with targeted changes.",
    );
  }

  if (improvements.length === 0) {
    improvements.push(
      "No major weaknesses were detected across the evaluated signals.",
    );
  }

  return {
    score,
    metrics,
    strengths,
    improvements,
    stats: {
      wordCount: words.length,
      sentenceCount: sentences.length,
      averageSentenceLength,
    },
  };
}