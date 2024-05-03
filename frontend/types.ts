type Vote = {
  id: number;
  option: string;
} | null;

type Voter = string | null;

interface Privote {
  id: bigint;
  owner: string;
  title: string;
  description: string;
  choices: string[];
  trustedPartyKey: string;
  players: string
  isClosed: boolean
}

interface Answer {
  player: string
  encryptedAnswer: string
}

type Answers = Answer[];

interface Result {
  player: string
  score: bigint

}
