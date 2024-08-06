import Image from "next/image";

export interface GameCard {
  imageSrc: string,
  id: number,
}
const cards: Array<GameCard> = [
  {
    id: 1,
    imageSrc: "https://picsum.photos/200",
  },
  {
    id: 2,
    imageSrc: "https://picsum.photos/200",
  },
]
export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div>Memory Snap Game</div>
      {
        cards.map(item => (
          <div key={item.id} className="flip-box">
            <div className="flip-box-inner">
              <div className="flip-box-front">
                <p className="text-2xl text-red-600">{item.id}</p>
              </div>
              <div className="flip-box-back">
                <img src={item.imageSrc} alt="card-image" width="200" height="200" />
              </div>
            </div>
          </div>
        ))
      }
    </main>
  );
}
