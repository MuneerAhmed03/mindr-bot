interface props {
  text: string[];
  ai: Ai;
}
export async function embed(props: props) {
  const { text, ai } = props;
  const embeddings = await ai.run(
    "@cf/baai/bge-base-en-v1.5",
    {
      text: text,
    },
    {
      gateway: {
        id: "gate",
        skipCache: true,
        cacheTtl: 0,
      },
    },
  );
  return embeddings.data;
}
