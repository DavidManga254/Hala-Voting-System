import { LoadingComponent } from "../components/load";
import { useState } from "react";
import image from '../assets/algorand.png'
import '../styles/home.css'
import { useNavigate } from "react-router-dom";


export function Homepage({}){

    const navigate = useNavigate()

    //function to check id validity
    const checkId = (e,id)=>{
        e.preventDefault();
        const element = document.getElementById(id);
        const idValue = element.value;
        if(idValue===""||idValue===null||idValue===undefined){
            alert('fill id number')
        }else{
            fetch('http://localhost:3000/confirmVoter',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id:idValue
                        })
                    }
                    ).then((response)=>response.json()).then((response)=>{
                        if(response.allowed===true){
                            navigate('/vote',{state:{id:idValue}})
                        }else{
                            alert('You are an unverified participant')
                        }
                    })
        }

        
    }

    return(
        <>
            <LoadingComponent/>
            <div className="homepage-wrap">
                
                <div className="user-input">
                    <div className="logo-wrap">
                       Powered by <img src={image}/>
                    </div>
                    <form className="user-id-form">
                        <h3>HALA VOTING APP</h3>
                        <label>Please Enter Your National Identification Number</label><br></br>
                        <input type="number" id="idvalue" placeholder="ID Number"></input><br/>
                        <div className="button-wrap">
                            <button onClick={(e)=>checkId(e,'idvalue')}>Verify ID</button>
                        </div>

                        <div className="button-wrap">
                            <button onClick={(e)=>navigate('/results',{replace:true})}>Check Vote Results</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
        
    )
}