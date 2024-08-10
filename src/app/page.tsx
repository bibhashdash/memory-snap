'use client';
import {useEffect, useState} from "react";

export interface GameCard {
  imageSrc: string,
  id: number,
}
const shuffle = (array: Array<GameCard>) => {
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

export default function Home() {

  const [cards, setCards] = useState<Array<GameCard>>([]);
  const [matchedCards, setMatchedCards] = useState<Array<GameCard>>([]);
  const resetGame = () => {
    const temp: Array<GameCard> = [];
    for (let i=0; i<8; i++) {
      temp.push({
        id: i,
        imageSrc: `https://picsum.photos/id/${getRandomNumber()}/200`
      })
    }
    setCards(temp);
  }

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const temp2 = shuffle(cards);
    setMatchedCards(temp2);
  }, [cards])
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div>Memory Snap Game</div>
      <button className="bg-gray-700 text-gray-50 px-2 py-1 rounded-md" onClick={resetGame}>Reset Game</button>
      <div className="grid grid-cols-4 gap-2">
        {
          cards.map(item => (
            <div key={item.id} className="flip-box">
              <div className="flip-box-inner">
                <div className="flex flex-col justify-center flip-box-front">
                  <p className="text-xl font-extrabold text-blue-700">Memory Snap</p>
                </div>
                <div className="flip-box-back">
                  <img src={item.imageSrc} alt="card-image" width="200" height="200" />
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="grid grid-cols-4 gap-2">
        {
          matchedCards.map(item => (
            <div key={item.id} className="flip-box">
              <div className="flip-box-inner">
                <div className="flex flex-col justify-center flip-box-front">
                  <p className="text-xl font-extrabold text-blue-700">Memory Snap</p>
                </div>
                <div className="flip-box-back">
                  <img src={item.imageSrc} alt="card-image" width="200" height="200" />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </main>
  );
}
