import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Test with a simple model
const output = await replicate.run(
  "zsxkib/instant-id:2e4785a4d80dadf580077b2244c8d7c05d8e3faac04a04c02d8e099dd2876789",
  {
    input: {
      image: "https://replicate.delivery/mgxm/3c310f6f-9976-430a-909a-91a950f13f4a.jpg",
      prompt: "anime portrait",
      num_outputs: 1,
    }
  }
);

console.log("Output type:", typeof output);
console.log("Is array:", Array.isArray(output));
console.log("First item type:", typeof (Array.isArray(output) ? output[0] : output));
console.log("Output:", output);
