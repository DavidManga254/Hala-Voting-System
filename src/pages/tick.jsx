import { Ticker } from "../components/tick";
import '../styles/tickscreen.css'
import { useLocation,useNavigate } from "react-router-dom";
export function TickScreen({}){
    const location = useLocation();
    const navigate = useNavigate();

    const userId = location.state;

    setTimeout(()=>{
        navigate('/',{replace:true})
    },4000);
    return(
        <div className="tick-wrap" >
            <div className="wrapper">
                <div className="tick-center">
                    <Ticker/>
                </div>
                
                <h3>{`Dear voter ${userId} your vote has been submitted, Redirecting for Next voter.`}</h3>
            </div>
        </div>
    )
}