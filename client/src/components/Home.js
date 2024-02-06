
function Home({ user }) {
  return (
    <div className="home-div">
      <h2>Welcome to NFT Community Review!</h2>
      {user ? (
  <p>
    Welcome back, {user.username}! We're glad to see you again.
  </p>
) : (
  <p>
    Explore our amazing projects and discover the creativity of our
    community.
  </p>
)}
    </div>
  );
}

export default Home;