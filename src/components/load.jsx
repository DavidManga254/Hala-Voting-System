import { useEffect } from "react"
import '../styles/loader.css'
import { preLoaderAnim } from "../animate/animate"

export function LoadingComponent(){

    const whenAnimationEnd= (event) => {
        // Remove the animated element from the DOM tree
        event.target.style.display='none';
      };

    useEffect(()=>{
        preLoaderAnim();
    },[]);

    return(
        <div className="Preloader" onAnimationEnd={(e)=>whenAnimationEnd(e)}>
            <div className="texts-container">
                <span>HALA</span>
                <span>VOTING</span>
                <span>APP</span>
            </div>
        </div>
    )
}