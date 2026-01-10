const response = await fetch("http://localhost:3000/analyze/text", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "I really enjoyed our date last night, but I'm not sure if I'm ready for a serious relationship right now. Let's just go with the flow?"
  })
});

const text = await response.text();
console.log("Status:", response.status);
console.log("Response:", text);
