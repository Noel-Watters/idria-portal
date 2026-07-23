//Homepage 
import HomePage from "./Home/page";

export default function Home() {
  return (
    <div className= "relative min-h-screen">
      <div className= "relative p-6 z-10 items-start">
        <div className="flex-1 flex flex-col">

          <main className="flex-1">
            <HomePage/>
          </main>
          <footer>

          </footer>

        </div>
      </div>
    </div>
  );
}
