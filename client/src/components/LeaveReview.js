import React, { useState, useEffect } from "react";

function LeaveReview({ user }) {
  const [userNFTs, setUserNFTs] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        const response = await fetch(`/leave_review`);
        const data = await response.json();
        setUserNFTs(data.owned_nfts);
      } catch (error) {
        console.error("An error occurred while fetching user's NFTs:", error);
      }
    };

    fetchUserNFTs();
  }, []);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const reviewData= {
        user_id: user.id,
        project_id: selectedNFT.project_id,
        review_text: reviewText,
    }
    try {
        const response = await fetch ('/leave_review', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewData)
        })
        if (response.ok) {
            alert("Review submitted successfully!")
        }
    } catch (error) {
        console.error("An error occured while attempting to leave review.")
    }
    console.log("Submitting review:", { reviewText, selectedNFT });
  };

  const groupedNFTs = userNFTs.reduce((grouped, nft) => {
    if (!grouped[nft.project_id]) {
      grouped[nft.project_id] = {
        project_name: nft.project_name,
        nfts: [],
      };
    }
    grouped[nft.project_id].nfts.push(nft);
    return grouped;
  }, {});

  return (
    <div className="leave-review-div">
      <h1>Select one of your NFT Token IDs below to leave a review for that project!</h1>
      <form onSubmit={handleSubmitReview}>
        {Object.entries(groupedNFTs).map(([projectId, { project_name, nfts }]) => (
          <div key={projectId}>
            <h4>{project_name}</h4>
            <div className="nft-grid">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="nft-item"
                  onClick={() => {
                    setSelectedNFT(nft)
                    }
                  }>
                  <p>{nft.token_id}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {selectedNFT && (
          <div>
            <h4>Leave a Review for {selectedNFT.project_name}: </h4>
            <label>        
              <textarea 
                className="leave-review-label"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Write your review here..."
              ></textarea>
            </label>
            <button type="submit">Submit Review</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default LeaveReview;