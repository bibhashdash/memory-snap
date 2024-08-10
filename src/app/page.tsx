'use client';
import {useEffect, useState} from "react";

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
const getRandomNumber = () => {
  return Math.floor(Math.random() * 200);
}

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
  const [score, setScore] = useState<number>(0)

  const resetGame = () => {
    setFirstFlip(null);
    setSecondFlip(null);
    setNumberOfClicks(0);
    setScore(0);
    const temp = generateUniqueNumbers();
    setCards(temp.map((item, index) => (
      {
        imageSrc: `https://picsum.photos/id/${item}/200`,
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
        setTimeout(() => {
          cardsMatchedFeedback();
        }, 500)
      }
      else {
        rotateCardsBack();
      }
    }
  }, [numberOfClicks])

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
    <main className="flex min-h-screen flex-col items-center gap-4 py-4">
      <div className="flex justify-between w-full max-w-5xl items-center text-2xl font-bold px-4">
        <p>Memory Snap Game</p>
        <p>{score}</p>
      </div>
      {/*<button className="bg-gray-700 text-gray-50 px-2 py-1 rounded-md" onClick={() => {*/}
      {/*  alert("resetting game");*/}
      {/*  resetGame()*/}
      {/*}}>Reset Game</button>*/}
      <div className="grid grid-cols-4 justify-items-center w-full max-w-5xl">
        {
          matchedCards.map(item => (
            <div
              onClick={() => handleClick(item.id, item.card.matchableId)}
              key={item.id}
              className="flip-box cursor-pointer w-full max-w-[200px] h-[100px] sm:h-[200px]"
            >
              <div id={item.id} className="flip-box-inner w-full">
                <div className="flex flex-col justify-center flip-box-front w-full">
                  <p className="sm:text-xs font-extrabold text-blue-700">Memory Snap</p>
                </div>
                <div className="flip-box-back w-fit">
                  <img src={item.card.imageSrc} alt="card-image" className="w-fit" />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </main>
  );
}
