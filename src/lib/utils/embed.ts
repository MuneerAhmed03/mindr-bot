interface props {
  text: string[];
  ai: Ai;
}

export async function embed(props: props) {
  const { text, ai } = props;
  const embeddings = await ai.run("@cf/baai/bge-small-en-v1.5", {
    text: text,
  },
  {
    gateway: {
        id: "gate"
    }
  }
);
  console.log(embeddings.data.length);
  return embeddings.data;
}
