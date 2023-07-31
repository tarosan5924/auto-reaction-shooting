import kuromoji, {
  IpadicFeatures,
  Tokenizer,
  TokenizerBuilder,
} from "kuromoji";

const replaceWords: readonly [string, string][] = [
  ["。", ""],
  ["、", ""],
  [",", ""],
  ["\\.", ""],
  ["!", ""],
  ["！", ""],
  ["・", ""],
  ["「", ""],
  ["」", ""],
  ["「", ""],
  ["｣", ""],
  ["『", ""],
  ["』", ""],
  [" ", ""],
  ["　", ""],
  ["ッ", ""],
  ["ャ", "ヤ"],
  ["ュ", "ユ"],
  ["ョ", "ヨ"],
  ["ァ", "ア"],
  ["ィ", "イ"],
  ["ゥ", "ウ"],
  ["ェ", "エ"],
  ["ォ", "オ"],
  ["ー", ""],
];

const defaultBuilder = kuromoji.builder({ dicPath: "public/dict" });

const getTokenizer = (
  builder: TokenizerBuilder<IpadicFeatures>
): Promise<Tokenizer<IpadicFeatures>> => {
  return new Promise((resolve, reject) => {
    builder.build((err, tokenizer) => {
      if (err) {
        reject(err);
      }
      resolve(tokenizer);
    });
  });
};

const preprocessing = (sentence: string): string => {
  for (const [from, to] of replaceWords) {
    sentence = sentence.replace(new RegExp(from, "g"), to);
  }

  return sentence;
};

const divide = (sentence: string, n: number): string[] => {
  const elements: string[] = [];
  const repeatNum = sentence.length - (n - 1);
  for (let i = 0; i < repeatNum; i++) {
    elements.push(sentence.slice(i, i + n));
  }
  return elements;
};

const listMaxDup = (divided: string[]): [string, number] => {
  const counts = new Map<string, number>();
  for (const element of divided) {
    counts.set(element, (counts.get(element) || 0) + 1);
  }
  let maxElement = "";
  let maxCount = 0;
  for (const [element, count] of counts.entries()) {
    if (count > maxCount) {
      maxElement = element;
      maxCount = count;
    }
  }
  return [maxElement, maxCount];
};

const sentenceMaxDupRate = (divided: string[], target: string): number => {
  return (
    divided.filter((element) => element === target).length / divided.length
  );
};

export const dajareWake = async (sentence: string, n: number = 3): Promise<boolean> => {
  const tokenizer = await getTokenizer(defaultBuilder);
  const tokenizedSentence = tokenizer.tokenize(sentence).map(word=>word.reading ?? "").join("");
  
  const preprocessed = preprocessing(tokenizedSentence);
  const divided = divide(preprocessed, n);
  
  if (divided.length === 0) {
    return false;
  } else {
    const [maxElement, maxCount] = listMaxDup(divided);
    if (maxCount > 1 && sentenceMaxDupRate(divided, maxElement) <= 0.5) {
      return true;
    } else {
      return false;
    }
  }
};
