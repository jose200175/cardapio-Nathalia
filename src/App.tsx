import NavBar from "./components/NavBar";
import FadeInSection from "./components/Fade";
import hotDog from "./assets/icon.jpeg";
import Teste from "./components/Teste";

function App() {
  return (
    <>
      <NavBar />
      <div className=" flex justify-center space-y-32 p-8">
        <FadeInSection>
          <div className="flex items-center">
            <img className="w-auto h-50" src={hotDog} alt="" />
            <p>Menu de delicias:</p>
          </div>
        </FadeInSection>
      </div>

      <div className="flex items-center justify-center">
        <Teste />
      </div>
    </>
  );
}

export default App;
