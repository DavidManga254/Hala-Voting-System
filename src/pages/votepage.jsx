import image from '../assets/algorand.png'
import ruto from '../assets/ruto.jpg'
import uhuru from '../assets/uhuru.jpg'
import raila from '../assets/raila.jpg'
import waja from '../assets/wajakoya.jpeg'
import '../styles/votepage.css'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function VotePage({}){
    const navigate = useNavigate();
    const location =useLocation();
    

    const userId = location.state.id;
    console.log('user id is',userId);
    
    const [voter, setvoter] = useState({
        presidentialName:'',
        presidentialAddress:'',
        voterId:'',
    })

    
    function toggle(e){
        const divs = document.getElementsByClassName('presidential-choice');
        console.log(divs)
        for(let i = 0; i<divs.length;i++){
            divs[i].classList.remove('is-selected');
        }
        e.target.classList.add('is-selected')
    }
    function submitvote(){
        if(voter.presidentialAddress === '' || voter.presidentialAddress === undefined || voter.presidentialAddress === null){
            alert('Please Choose your candidate choice')
        }else{
            console.log('chosen id is',userId)
            
            fetch('http://localhost:3000/vote',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chosen:voter.presidentialAddress,
                id:userId
            })
        }
        ).then((response)=>response.json()).then((response)=>{
            if(response.allowed){
                navigate('/verified',{state:userId})
            }else{
                alert('You have already voted,Your vote is rejected. Restarting the Process')
                navigate('/');
            }
        })
        }
        
    }
    return(
        <div className="voter-wrap">
            <div className='decision-wrap'>
                <div className="logo-wrap">
               Powered by <img src={image} />
            </div>
            <h2>Choose Your Presidential Candidate</h2>
            <div  className='voter-choice-wrap'>
                <div onClick={(e)=>{setvoter((previous)=>{return {...previous,presidentialName:'Uhuru Mwigai Kenyatta',presidentialAddress:'0'}});toggle(e)}} className='presidential-choice'>
                    <div className='image-wrapper'>
                        <img src={uhuru}/>
                    </div>
                    
                    <h3 className='presidential-name'>Uhuru Mwigai Kenyatta</h3>
                </div>

                <div onClick={(e)=>{setvoter((previous)=>{return {...previous,presidentialName:'Raila Amollo Odinga',presidentialAddress:'1'}});toggle(e)}} className='presidential-choice'>
                    <img src={raila}/>
                    <h3 className='presidential-name'>Raila Amollo Odinga</h3>
                </div>

                <div onClick={(e)=>{setvoter((previous)=>{return {...previous,presidentialName:'William Samoei Ruto',presidentialAddress:'2'}});toggle(e)}} className='presidential-choice'>
                    <img src={ruto}/>
                    <h3 className='presidential-name'>William Samoei Ruto</h3>
                </div>

                <div onClick={(e)=>{setvoter((previous)=>{return {...previous,presidentialName:'George Luchiri Wajakoyah',presidentialAddress:'3'}});toggle(e)}} className='presidential-choice'>
                    <img src={waja}/>
                    <h3 className='presidential-name'>George Luchiri wajakoyah</h3>
                </div>

                
            </div>
            <div className='vote-button'>
                <button onClick={()=>submitvote()}>{voter.presidentialName!==''?`Vote for ${voter.presidentialName}`:`Please Choose Your Desired Candidate`}</button>
                </div>
            
            </div>
            
        </div>
    )
}