
const testFetch = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/loans');
        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Body: ${text}`);
    } catch (error) {
        console.error("Fetch failed:", error.message);
    }
};

testFetch();
