const apiKey = process.env.GEMINI_API_KEY?.trim();

async function checkGeneration() {
    if (!apiKey) {
        console.error("No API Key");
        return;
    }

    const modelName = "gemini-2.0-flash-exp";
    console.log("Testing generation with:", modelName);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, are you working?" }] }]
            })
        });

        if (!response.ok) {
            console.error("Generation REST Error:", response.status, await response.text());
            return;
        }
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Success! Response:", text);

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

checkGeneration();
