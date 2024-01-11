import React, { useEffect, useState } from "react";

function MyReviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Reviews state:", reviews);
  }, [reviews]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        if (user.id) {
          const response = await fetch(`/my_reviews`);
          const data = await response.json();
          if (response.ok) {
            setReviews(data.reviews);
            setError(null);
          } else {
            console.error("Failed to fetch reviews:", response.statusText);
            setError("Failed to fetch reviews");
          }
        } else {
          console.error("User or user id is undefined.");
          setError("User or user id is undefined");
        }
      } catch (error) {
        console.error("An error occurred during fetch:", error);
        setError("An error occurred during fetch");
      }
    };
    fetchMyReviews();
  }, [user]);

  const handleEdit = (reviewId, reviewText) => {
    setEditingReviewId(reviewId);
    setEditedText(reviewText);
  };

  const handleConfirmEdit = async (reviewId) => {
    try {
      const response = await fetch(`/my_reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            review_text: editedText,
            review_id: editingReviewId,
         })
      });

      if (response.ok) {
        console.log(`Review with id ${reviewId} updated successfully`);
        setEditingReviewId(null);
        setError(null);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId ? { ...review, review_text: editedText } : review
          )
        );
      } else {
        console.error(`Failed to update review with id ${reviewId}`);
        setError("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setError("Error updating review");
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedText("");
    setError(null);
  };

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`/my_reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`Deleting review with id ${reviewId}`);
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        setError(null);
        alert("Review Deleted Successfully")
      } else {
        console.error("Unsuccessful.");
        setError("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Error deleting review");
    }
  };

  return (
    <div>
      <h2>My Reviews</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              {editingReviewId === review.id ? (
                <>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button onClick={() => handleConfirmEdit(review.id)}>Confirm</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{review.review_text}</p>
                  <button onClick={() => handleEdit(review.id, review.review_text)}>
                    Edit Review
                  </button>
                  <button onClick={() => handleDelete(review.id)}>Delete Review</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyReviews;
