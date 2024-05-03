export const encryptVote = async (vote: string) => {
  const resp = await fetch("http://localhost:3001/encrypt-vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vote,
    }),
  });
  return resp.json();
};

export const publishResults = async (id: string) => {
  const resp = await fetch(`http://localhost:3001/publish-results/${id}`);

  return await resp.json();
};

export const getPrivote = async (id: string) => {
  const resp = await fetch(`http://localhost:3001/privote/${id}`);
  const data = await resp.json();
  console.log(data);
  return data;
};
