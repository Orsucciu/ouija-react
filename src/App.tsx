import React, { useRef, useEffect } from 'react';
import board from './assets/Ouija-main.jpg';
import planchette from './assets/Alain-Johannes-Ouija-Planchette.png';
import './App.scss';
import { coordinates, CoordinateType } from './coordinates';

function App() {

  const boardRef = useRef<HTMLImageElement>(null);
  const planchetteRef = useRef<HTMLImageElement>(null);
  const synth = window.speechSynthesis;
  const voices = synth.getVoices()

  const movementManager = () => {
    
    if (planchetteRef.current) {
      const marginX = 0.08
      const marginY = 0.08;
      const coordX = Math.random() * (1-marginX*2) + marginX 
      const coordY = Math.random() * (1-marginY) + marginY
      
      const coordObject = coordinatesToLetter(coordX, coordY)
      
      const minDuration = 4
      const maxDuration = 6.5
      const moveDuration = Math.random() * (maxDuration-minDuration) + minDuration
      
      planchetteRef.current.style.transitionDuration = moveDuration + 's'
      movePlanchette(coordX, coordY)

      setTimeout(() => {
        if (coordObject) {

          let word = ""

          if(coordObject.type === "zone"){

            word = coordObject.sentence

          }else if(coordObject.type === "char"){

            word = coordObject.char
          }

          var utterThis = new SpeechSynthesisUtterance(word) as any;
          utterThis.voice = voices[0];

          utterThis.pitch = 0.1;
          utterThis.rate = 0.8;
          synth.speak(utterThis);
        
        }

        if(!(coordObject && coordObject.type === "zone" && coordObject.sentence === "Good Bye") ){
          movementManager();
        }

      }, moveDuration * 1000)
    }
  }

  useEffect(() => {
    if(planchetteRef.current && boardRef.current){
      planchetteRef.current.style.left = Math.random() * 100 + "%"
      planchetteRef.current.style.top = Math.random() * 100 + "%"
    }

    setTimeout(() => {
      movementManager();
    }, 0)
    

  }, [])

  const movePlanchette = (coordX: number, coordY: number) => {

    if(planchetteRef.current && boardRef.current){
      planchetteRef.current.style.left = coordX * 100 + "%"
      planchetteRef.current.style.top = coordY * 100 + "%"
    }
  }
  
  const coordinatesToLetter = (coordX: number, coordY: number): CoordinateType|null => {

    let lowest: null|number = null
    let zone: null|CoordinateType = null
    let closestPoint: CoordinateType | null = null
    const mouseX = coordX
    const mouseY = coordY
    coordinates.forEach(element => {
      
      if(element.type === "char"){

        const distance = Math.sqrt( ((mouseX - element.x) * (mouseX - element.x)) + ((mouseY - element.y) * (mouseY - element.y)) )
        if(lowest === null || distance < lowest) {

          lowest = distance
          closestPoint = element
        }
      } else if (element.type === "zone") {

        if (mouseX > element.left && mouseY > element.top 
          && mouseX < element.right && mouseY < element.bottom) {
          zone = element
        }
        
        
      }
    });

    if (zone) {
      return zone
    } else {
      if (lowest && lowest < 0.06) {
        return closestPoint
      }

      return null
    }
  }

  return (
    <div className="App">
      <div className="container">
        <img 
          ref={boardRef}
          className="board" 
          src={board} 
        />
        <img 
          ref={planchetteRef}
          className="planchette" 
          src={planchette} 
        />
      </div>
      
    </div>
  );
}

export default App;
