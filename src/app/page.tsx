'use client';
import {useEffect, useState} from "react";
import Lottie from "lottie-react";
import celebration from './celebration.json';
export interface BasicCard {
  imageSrc: string,
  matchableId: string,
}
export interface GameCard {
  card: BasicCard,
  id: string,
}
const shuffle = (array: Array<BasicCard>) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export interface DrawFlip {
  id: string,
  matchableId: string,
}

function generateUniqueNumbers(): Array<number> {
  const set: Set<number> = new Set();

  while(set.size < 8) {
    set.add(Math.floor(Math.random() * 500));
  }

  return Array.from(set);
}

export default function Home() {
  const [cards, setCards] = useState<Array<BasicCard>>([]);
  const [matchedCards, setMatchedCards] = useState<Array<GameCard>>([]);
  const [firstFlip, setFirstFlip] = useState<DrawFlip | null>(null);
  const [secondFlip, setSecondFlip] = useState<DrawFlip | null>(null);
  const [numberOfClicks, setNumberOfClicks] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [numberOfTries, setNumberOfTries] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  const resetGame = () => {
    const newTemp = document.querySelector('.rotate');
    newTemp && newTemp.classList.remove('rotate');

    setFirstFlip(null);
    setSecondFlip(null);
    setNumberOfClicks(0);
    setNumberOfTries(0);
    setLevel(0);
    setScore(0);
    const temp = generateUniqueNumbers();
    setCards(temp.map((item, index) => (
      {
        imageSrc: `https://picsum.photos/id/${item}/150`,
        matchableId: `photo${index}`,
      }
    )))
  }

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const temp2 = shuffle(cards);
    const temp3 = [...cards, ...temp2]
    const temp4: Array<GameCard> = temp3.map((item, index) => (
      {
        card: item,
        id: `photo${index}`,
      }
    ))
    setMatchedCards(temp4)
  }, [cards]);

  const updateGameState = (id: string, matchableId: string) => {
    if (firstFlip) {
      setSecondFlip({
        id: id,
        matchableId: matchableId,
      });
    } else {
      setFirstFlip({
        id: id,
        matchableId: matchableId,
      });
    }
  }

  useEffect(() => {
    if (numberOfClicks > 0 && numberOfClicks % 2 === 0) {
      if (firstFlip && secondFlip && firstFlip.matchableId === secondFlip.matchableId) {
        setScore(prevState => prevState + 1);
        setTimeout(() => {
          cardsMatchedFeedback();
        }, 500)
      }
      else {
        rotateCardsBack();
      }
      setNumberOfTries(prevState => prevState + 1);
    }
  }, [numberOfClicks]);

  const handleClick = (id: string, matchableId: string) => {
    if (firstFlip?.id === id) {
      const card = document.querySelector(`#${id}`)
      if (card) {
        card.classList.remove('rotate')
      }
      setFirstFlip(null);
      setNumberOfClicks(0);
      return;
    }

    setNumberOfClicks(prevState => prevState + 1);
    const element = document.querySelector(`#${id}`)
    if (element) {
      element.classList.add('rotate');
      updateGameState(id, matchableId);
    }
  }

  const rotateCardsBack = () => {
    setTimeout(() => {
      const card1 = document.querySelector(`#${firstFlip?.id}`)
      const card2 = document.querySelector(`#${secondFlip?.id}`)
      if (card1 && card2) {
        card1.classList.remove('rotate');
        card2.classList.remove('rotate');
      }
      setFirstFlip(null);
      setSecondFlip(null);
    }, 1000)
  }

  const cardsMatchedFeedback = () => {
    const card1 = document.querySelector(`#${firstFlip?.id}`)
    const card2 = document.querySelector(`#${secondFlip?.id}`)
    if (card1 && card2) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      setTimeout(() => {
        card1.classList.add('hidden')
        card2.classList.add('hidden')
      }, 500)
    }
    setFirstFlip(null);
    setSecondFlip(null);
  }

  return (
    <main className="flex h-full flex-col items-center gap-6 py-4">
      {
        score === 8 && (
          <div className="absolute w-full h-full z-10">
            <Lottie animationData={celebration} />
          </div>
        )
      }
      <div className="flex flex-col w-full max-w-5xl items-center text-2xl font-bold px-4 gap-4">
        <h1>Memory Snap Game</h1>
        <div className="flex w-full justify-between">
          <h2>Score: <span className="text-blue-500">{score}</span></h2>
          <h2>Attempts: <span className="text-blue-500 w-[90px]">{numberOfTries}</span></h2>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1 px-1 justify-items-center w-full max-w-5xl">
        {
          matchedCards.map(item => (
            <div
              onClick={() => handleClick(item.id, item.card.matchableId)}
              key={item.id}
              className="flip-box cursor-pointer w-full max-w-[150px] h-[100px] sm:h-[150px]"
            >
              <div id={item.id} className="flip-box-inner w-full">
                <div className="bg-green-700 flex flex-col justify-center items-center flip-box-front w-full rounded-md">
                  <img
                    alt="rocket icon"
                    className="rounded-md p-6"
                    src="/rocket_launch_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png"
                    width="96"
                  />
                </div>
                <div className="flip-box-back w-full rounded-md">
                  <img src={item.card.imageSrc} alt="card-image" className="w-fit rounded-md box-border border-2 border-green-700" />
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="w-full max-w-5xl flex justify-between px-4">
        <h2 className="text-2xl font-bold">Level: {level}</h2>
        <button onClick={resetGame} className="px-2 py-1 bg-gray-700 text-gray-50 rounded-md">Reset Game</button>
      </div>
    </main>
  );
}
