import { useEffect } from "react";

export default function ProgressBar(){
      const thresholds = [
      { qty: 3, discount: "10%" },
      { qty: 5, discount: "20%" },
      { qty: 7, discount: "30%" }
    ];

    useEffect(()=>{

    },[])

    return<>
    <div id="cart-progress-wrapper" style={{display: "none"}}>
  <span className="progress-message" id="progress-msg">Checking your rewards...</span>
  <div className="progress-track">
    <div id="progress-fill"></div>
  </div>
  <div className="tier-markers">
    <span>0</span>
    <span>3 Items (10%)</span>
    <span>5 Items (20%)</span>
    <span>7+ Items (30%)</span>
  </div>
</div>
    </>
}