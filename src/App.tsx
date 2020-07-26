import React, { useRef, useEffect } from 'react';
import board from './assets/Ouija-main.jpg';
import planchette from './assets/Alain-Johannes-Ouija-Planchette.png';
import './App.scss';
import { coordinates, CoordinateType } from './coordinates';

function App() {

  const boardRef = useRef<HTMLImageElement>(null);
  const planchetteRef = useRef<HTMLImageElement>(null);

  const movementManager = () => {

  }

  useEffect(() => {
    //console.log(planchetteRef)
    if(planchetteRef.current && boardRef.current){
      planchetteRef.current.style.left = Math.random() * 100 + "%"
      planchetteRef.current.style.top = Math.random() * 100 + "%"
    }

  }, [])
  
  //let list = [];


  
  const handleDown = (event : React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    // const width = boardRef.current?.clientWidth;
    // const height = boardRef.current?.clientHeight;
    // if (width && height) {
    //   const element = {
    //     type:'char', 
    //     char:'A', 
    //     x:event.pageX/width, 
    //     y:event.pageY/height,
    //   }
    //   list.push(element);
    //   console.log(list);
    // }

    if(planchetteRef.current && boardRef.current){
      const rect = boardRef.current.getBoundingClientRect();
      //console.log(rect)
      planchetteRef.current.style.left = (event.clientX-rect.left) + "px"
      planchetteRef.current.style.top = (event.clientY-rect.top) + "px"
    
      let lowest: null|number = null
      let zone: null|CoordinateType = null
      let closestPoint: CoordinateType | null = null
      const mouseX = (event.clientX-rect.left) / rect.width
      const mouseY = (event.clientY-rect.top) / rect.height
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
        console.log(zone)
      } else {
        if (lowest && lowest < 0.04) {
          console.log(lowest)
          console.log(closestPoint)
        }
      }
    }
  }

  return (
    <div className="App">
      <div className="container">
        <img 
          ref={boardRef}
          onMouseDown={handleDown} 
          className="board" 
          src={board} 
        />
        <img 
          ref={planchetteRef}
          className="planchette" 
          src={planchette} 
        />
        {/* <div className="points">
          {coordinates.map((element, index)=> element.type === "char" && (
            <div key={index} className="point" style={{left:(element.x*100)+'%', top:(element.y*100)+'%'}}></div>
          ))}
        </div> */}
        {/* <div className="zones">
          {coordinates.map((element, index)=> element.type === "zone" && (
            <div key={index} className="zone" style={{left:((element.left)*100)+'%', top:((element.top)*100)+'%', height:(element.bottom-element.top)*100+'%', width:(element.right-element.left)*100+'%'}}></div>
          ))}
        </div> */}
      </div>
      
    </div>
  );
}

export default App;
