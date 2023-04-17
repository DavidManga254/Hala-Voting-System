import uhuru from '../assets/uhuru.jpg';
import raila from '../assets/raila.jpg';
import ruto from '../assets/ruto.jpg';
import waja from '../assets/wajakoya.jpeg';
import logo from '../assets/algorand.png'
import { useEffect,useState } from 'react';
import '../styles/results.css'
import { useNavigate } from 'react-router-dom';
import '../styles/home.css'
export function Results({}){
    const [pollResults,setPoll] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
          const response = await fetch('http://localhost:3000/results', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              null: null,
            }),
          });

          function sortObjectsByVotes(objects) {
            return objects.sort((a, b) => b.votes - a.votes);
          }
        
        
        

          const data = await response.json();
          console.log('here is the response', data);

          const sortedArray = sortObjectsByVotes(data);
          setPoll(sortedArray);
        }
      
        fetchData();
      }, []);
      

    var totalvotes = 0;

    if(pollResults !== null){
        pollResults.forEach(element => {
            totalvotes += element.votes
        });
    }  
    
    
    return(
        <div className="results-wrap">
            <div className='logo-wrap'>
                powered by<img src={logo}/>
            </div>
            <h3 className='header'>Hala Voting App</h3>
            <h3 className='header'>Current Votes Results</h3>
            <div className="votes-results">
                {
                   pollResults!==null? pollResults.map((candidate,index)=>{
                        if(candidate.name === 'uhuru'){
                            return(
                                <div className="specific-participant">
                    <div className='participant-photo'>
                        <img src={uhuru}/>
                    </div>
                    <div className='participant-results'>
                        <div className='participant-name'>
                            <h3>Uhuru Mwigai Kenyatta</h3>
                        </div>
                        <div className='participant-resulter'>
                            <h3>Votes {((candidate.votes/totalvotes)*100).toFixed(2)}% </h3>
                        </div>
                    </div>
                </div>
                            )
                        }else if (candidate.name === 'raila'){
                            return(
                                <div className="specific-participant">
                    <div className='participant-photo'>
                        <img src={raila}/>
                    </div>
                    <div className='participant-results'>
                        <div className='participant-name'>
                            <h3>Raila Amollo Odinga</h3>
                        </div>
                        <div className='participant-resulter'>
                            <h3>Votes {((candidate.votes/totalvotes)*100).toFixed(2)}% </h3>
                        </div>
                    </div>
                </div>
                            )
                        }else if (candidate.name === 'ruto'){
                            return(
                                <div className="specific-participant">
                    <div className='participant-photo'>
                        <img src={ruto}/>
                    </div>
                    <div className='participant-results'>
                        <div className='participant-name'>
                            <h3>William Samoei Ruto</h3>
                        </div>
                        <div className='participant-resulter'>
                            <h3>Votes {((candidate.votes/totalvotes)*100).toFixed(2)}% </h3>
                        </div>
                    </div>
                </div>
                            )
                        }else if(candidate.name === 'wajakoya'){
                            return(
                                <div className="specific-participant">
                    <div className='participant-photo'>
                        <img src={waja}/>
                    </div>
                    <div className='participant-results'>
                        <div className='participant-name'>
                            <h3>George Luchiri Wajakoyah</h3>
                        </div>
                        <div className='participant-resulter'>
                            <h3>Votes {((candidate.votes/totalvotes)*100).toFixed(2)}% </h3>
                        </div>
                    </div>
                </div>
                            )
                        }
                    }):null
                }
            </div>
            <div className='user-id-form'>
                <button onClick={()=>navigate('/')}>Go back to Vote</button>
            </div>
        </div>
    )
}
